const test = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { mkdtemp, readFile, rm, writeFile } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const { join, resolve } = require('node:path');
const { createServer } = require('node:net');

const serverPath = resolve(__dirname, '../src/server.js');
const allowedOrigin = 'http://localhost:5173';
let temporaryDirectory;
let dataFile;
let port;
let child;
let output = '';

async function getFreePort() {
  const probe = createServer();
  await new Promise((resolveListen, reject) => {
    probe.once('error', reject);
    probe.listen(0, '127.0.0.1', resolveListen);
  });
  const { port: freePort } = probe.address();
  await new Promise((resolveClose, reject) => probe.close((error) => error ? reject(error) : resolveClose()));
  return freePort;
}

async function waitUntilReady() {
  const deadline = Date.now() + 8_000;
  let lastError;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`API завершился до запуска. Вывод:\n${output}`);
    }
    try {
      const response = await fetch(`http://127.0.0.1:${port}/users`);
      if (response.ok) return;
      lastError = new Error(`API вернул HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 50));
  }
  throw new Error(`API не запустился за 8 секунд: ${lastError?.message}\n${output}`);
}

function startServer() {
  child = spawn(process.execPath, [serverPath], {
    env: {
      ...process.env,
      HOST: '127.0.0.1',
      PORT: String(port),
      DATA_FILE: dataFile,
      CORS_ORIGINS: allowedOrigin,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  output = '';
  child.stdout.setEncoding('utf8').on('data', (chunk) => { output += chunk; });
  child.stderr.setEncoding('utf8').on('data', (chunk) => { output += chunk; });
  return waitUntilReady();
}

async function stopServer() {
  if (!child || child.exitCode !== null) return;
  const current = child;
  current.kill('SIGTERM');
  await new Promise((resolveExit) => {
    const timeout = setTimeout(() => {
      current.kill('SIGKILL');
      resolveExit();
    }, 2_000);
    current.once('exit', () => {
      clearTimeout(timeout);
      resolveExit();
    });
  });
}

function apiUrl(path) {
  return `http://127.0.0.1:${port}${path}`;
}

async function jsonRequest(path, options = {}) {
  const response = await fetch(apiUrl(path), {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  return { response, body: text ? JSON.parse(text) : null };
}

test('API выдерживает основные CRUD-сценарии и граничные случаи', async (t) => {
  temporaryDirectory = await mkdtemp(join(tmpdir(), 'team-tasks-api-'));
  dataFile = join(temporaryDirectory, 'data', 'db.json');
  port = await getFreePort();
  t.after(async () => {
    await stopServer();
    await rm(temporaryDirectory, { recursive: true, force: true });
  });
  await startServer();

  await t.test('возвращает исходные данные и корректно фильтрует задачи', async () => {
    const users = await jsonRequest('/users');
    assert.equal(users.response.status, 200);
    assert.equal(users.body.length, 4);
    assert.ok(users.body.every((user) => typeof user.id === 'string'));

    const filtered = await jsonRequest('/tasks?userId=1&status=todo');
    assert.equal(filtered.response.status, 200);
    assert.ok(filtered.body.every((task) => task.userId === '1' && task.status === 'todo'));

    const empty = await jsonRequest('/tasks?userId=1&status=done');
    assert.equal(empty.response.status, 200);
    assert.ok(Array.isArray(empty.body));

    const missingUser = await jsonRequest('/tasks?userId=unknown');
    assert.equal(missingUser.response.status, 404);

    const missingFilter = await jsonRequest('/tasks');
    assert.equal(missingFilter.response.status, 400);

    const duplicateFilter = await jsonRequest('/tasks?userId=1&status=todo&status=done');
    assert.equal(duplicateFilter.response.status, 400);

    const invalidFilter = await jsonRequest('/tasks?userId=1&status=unexpected');
    assert.equal(invalidFilter.response.status, 400);

    const unknownRoute = await jsonRequest('/unknown');
    assert.equal(unknownRoute.response.status, 404);

    const unknownTask = await jsonRequest('/tasks/not-a-task');
    assert.equal(unknownTask.response.status, 404);
  });

  await t.test('ограничивает origin, JSON и размер входящих данных', async () => {
    const allowed = await fetch(apiUrl('/users'), { headers: { Origin: allowedOrigin } });
    assert.equal(allowed.status, 200);
    assert.equal(allowed.headers.get('access-control-allow-origin'), allowedOrigin);
    assert.equal(allowed.headers.get('x-content-type-options'), 'nosniff');
    assert.equal(allowed.headers.get('x-frame-options'), 'DENY');

    const forbidden = await fetch(apiUrl('/users'), { headers: { Origin: 'https://not-allowed.example' } });
    assert.equal(forbidden.status, 403);

    const malformed = await fetch(apiUrl('/tasks'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{',
    });
    assert.equal(malformed.status, 400);

    const oversized = await fetch(apiUrl('/tasks'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'x'.repeat(17 * 1024) }),
    });
    assert.equal(oversized.status, 413);
  });

  let createdTask;
  await t.test('валидирует создание, обновление и удаление', async () => {
    const blankTitle = await jsonRequest('/tasks', {
      method: 'POST',
      body: JSON.stringify({ userId: '1', title: '   ' }),
    });
    assert.equal(blankTitle.response.status, 400);

    const longTitle = await jsonRequest('/tasks', {
      method: 'POST',
      body: JSON.stringify({ userId: '1', title: 'x'.repeat(121) }),
    });
    assert.equal(longTitle.response.status, 400);

    const unknownField = await jsonRequest('/tasks', {
      method: 'POST',
      body: JSON.stringify({ userId: '1', title: 'Проверка', admin: true }),
    });
    assert.equal(unknownField.response.status, 400);

    const invalidUser = await jsonRequest('/tasks', {
      method: 'POST',
      body: JSON.stringify({ userId: 'missing', title: 'Проверка' }),
    });
    assert.equal(invalidUser.response.status, 404);

    const invalidStatus = await jsonRequest('/tasks', {
      method: 'POST',
      body: JSON.stringify({ userId: '1', title: 'Проверка', status: 'blocked' }),
    });
    assert.equal(invalidStatus.response.status, 400);

    const created = await jsonRequest('/tasks', {
      method: 'POST',
      body: JSON.stringify({ userId: '1', title: `  ${'x'.repeat(120)}  `, status: 'todo' }),
    });
    assert.equal(created.response.status, 201);
    assert.equal(created.body.title, 'x'.repeat(120));
    assert.equal(created.body.userId, '1');
    assert.equal(typeof created.body.id, 'string');
    assert.ok(created.response.headers.get('location').endsWith(created.body.id));
    createdTask = created.body;

    const badPatch = await jsonRequest(`/tasks/${createdTask.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ title: '' }),
    });
    assert.equal(badPatch.response.status, 400);

    const unknownPatchField = await jsonRequest(`/tasks/${createdTask.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ title: 'Название', unexpected: 'field' }),
    });
    assert.equal(unknownPatchField.response.status, 400);

    const patched = await jsonRequest(`/tasks/${createdTask.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ title: 'Обновлённая задача', status: 'doing' }),
    });
    assert.equal(patched.response.status, 200);
    assert.equal(patched.body.title, 'Обновлённая задача');
    assert.equal(patched.body.status, 'doing');

    const deleted = await fetch(apiUrl(`/tasks/${createdTask.id}`), { method: 'DELETE' });
    assert.equal(deleted.status, 204);
    assert.equal(await deleted.text(), '');

    const missingAfterDelete = await jsonRequest(`/tasks/${createdTask.id}`);
    assert.equal(missingAfterDelete.response.status, 404);
  });

  await t.test('параллельное создание не теряет записи', async () => {
    const responses = await Promise.all([
      jsonRequest('/tasks', { method: 'POST', body: JSON.stringify({ userId: '2', title: 'Параллельная задача A' }) }),
      jsonRequest('/tasks', { method: 'POST', body: JSON.stringify({ userId: '2', title: 'Параллельная задача B' }) }),
    ]);
    assert.ok(responses.every(({ response }) => response.status === 201));
    const allTasks = await jsonRequest('/tasks?userId=2');
    const titles = allTasks.body.map((task) => task.title);
    assert.ok(titles.includes('Параллельная задача A'));
    assert.ok(titles.includes('Параллельная задача B'));
  });

  await t.test('изменения переживают перезапуск API', async () => {
    const beforeRestart = await readFile(dataFile, 'utf8');
    assert.match(beforeRestart, /Параллельная задача A/);
    await stopServer();
    await startServer();
    const afterRestart = await jsonRequest('/tasks?userId=2');
    assert.ok(afterRestart.body.some((task) => task.title === 'Параллельная задача A'));
  });
});

test('повреждённый файл базы не затирается начальными данными', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'team-tasks-corrupt-'));
  const brokenFile = join(directory, 'db.json');
  const portForBrokenServer = await getFreePort();
  const originalContent = '{broken-json';
  await writeFile(brokenFile, originalContent);

  const processWithBrokenDatabase = spawn(process.execPath, [serverPath], {
    env: {
      ...process.env,
      HOST: '127.0.0.1',
      PORT: String(portForBrokenServer),
      DATA_FILE: brokenFile,
    },
    stdio: ['ignore', 'ignore', 'pipe'],
  });
  let stderr = '';
  processWithBrokenDatabase.stderr.setEncoding('utf8').on('data', (chunk) => { stderr += chunk; });
  const exitCode = await new Promise((resolveExit) => processWithBrokenDatabase.once('exit', resolveExit));
  assert.notEqual(exitCode, 0);
  assert.match(stderr, /Не удалось прочитать базу данных/);
  assert.equal(await readFile(brokenFile, 'utf8'), originalContent);
  await rm(directory, { recursive: true, force: true });
});

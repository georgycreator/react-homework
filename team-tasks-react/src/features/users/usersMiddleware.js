import { API_BASE_URL, API_REQUEST_TIMEOUT_MS } from '../../app/apiConfig'
import { usersFailed, usersLoaded, usersLoading, usersRequested } from './usersSlice'

let fallbackRequestSequence = 0

function validateUsers(items) {
  if (!Array.isArray(items)) {
    throw new Error('Сервер вернул некорректный список участников.')
  }

  const ids = new Set()
  for (const user of items) {
    if (
      !user ||
      typeof user !== 'object' ||
      typeof user.id !== 'string' ||
      !/^[A-Za-z0-9_-]{1,64}$/.test(user.id) ||
      typeof user.name !== 'string' ||
      !user.name.trim() ||
      user.name.length > 100 ||
      typeof user.email !== 'string' ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email) ||
      user.email.length > 254 ||
      ids.has(user.id)
    ) {
      throw new Error('Сервер вернул участника с некорректными или повторяющимися данными.')
    }
    ids.add(user.id)
  }

  return items
}

async function loadUsers(dispatch) {
  const requestId = globalThis.crypto?.randomUUID?.()
    || `${Date.now()}-${++fallbackRequestSequence}`
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), API_REQUEST_TIMEOUT_MS)
  dispatch(usersLoading({ requestId }))

  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    })

    if (!response.ok) {
      throw new Error(`Ошибка сервера: HTTP ${response.status}.`)
    }

    let payload
    try {
      payload = await response.json()
    } catch {
      throw new Error('Сервер вернул некорректный JSON.')
    }
    const items = validateUsers(payload)
    dispatch(usersLoaded({ requestId, items }))
  } catch (error) {
    const message = controller.signal.aborted
      ? 'Сервер не ответил за 10 секунд. Проверьте API и попробуйте ещё раз.'
      : error instanceof Error
        ? error.message
        : 'Не удалось загрузить участников.'

    dispatch(usersFailed({ requestId, message }))
  } finally {
    clearTimeout(timeoutId)
  }
}

export const usersMiddleware = (api) => (next) => (action) => {
  // Сначала передаём обычный action дальше: middleware не нарушает поток Redux.
  const result = next(action)

  if (usersRequested.match(action) && api.getState().users.status !== 'loading') {
    void loadUsers(api.dispatch)
  }

  return result
}

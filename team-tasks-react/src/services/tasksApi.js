import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_BASE_URL, API_REQUEST_TIMEOUT_MS } from '../app/apiConfig'

const VALID_STATUSES = new Set(['todo', 'doing', 'done'])
const SAFE_ID = /^[A-Za-z0-9_-]{1,64}$/

function validateTask(task) {
  if (
    !task || typeof task !== 'object' || Array.isArray(task) ||
    typeof task.id !== 'string' || !SAFE_ID.test(task.id) ||
    typeof task.userId !== 'string' || !SAFE_ID.test(task.userId) ||
    typeof task.title !== 'string' || !task.title.trim() || task.title.length > 120 ||
    !VALID_STATUSES.has(task.status)
  ) {
    throw new Error('Сервер вернул задачу с некорректными данными.')
  }
  return task
}

function validateTaskList(tasks) {
  if (!Array.isArray(tasks)) {
    throw new Error('Сервер вернул некорректный список задач.')
  }
  const ids = new Set()
  for (const task of tasks) {
    validateTask(task)
    if (ids.has(task.id)) throw new Error('Сервер вернул повторяющийся ID задачи.')
    ids.add(task.id)
  }
  return tasks
}

export const tasksApi = createApi({
  reducerPath: 'tasksApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/`,
    timeout: API_REQUEST_TIMEOUT_MS,
    prepareHeaders: (headers) => {
      headers.set('Accept', 'application/json')
      return headers
    },
  }),
  tagTypes: ['Task'],
  endpoints: (build) => ({
    getTasks: build.query({
      query: ({ userId, status }) => ({
        url: 'tasks',
        params: status ? { userId, status } : { userId },
      }),
      transformResponse: validateTaskList,
      providesTags: (items = []) => [
        { type: 'Task', id: 'LIST' },
        ...items.map(({ id }) => ({ type: 'Task', id })),
      ],
    }),
    getTask: build.query({
      query: (taskId) => `tasks/${encodeURIComponent(taskId)}`,
      transformResponse: validateTask,
      providesTags: (_result, _error, taskId) => [{ type: 'Task', id: taskId }],
    }),
    addTask: build.mutation({
      query: ({ userId, title, status = 'todo' }) => ({
        url: 'tasks',
        method: 'POST',
        body: { userId, title, status },
      }),
      transformResponse: validateTask,
      invalidatesTags: (_result, error) => (error ? [] : [{ type: 'Task', id: 'LIST' }]),
    }),
    updateTask: build.mutation({
      query: ({ id, ...patch }) => ({
        url: `tasks/${encodeURIComponent(id)}`,
        method: 'PATCH',
        body: patch,
      }),
      transformResponse: validateTask,
      invalidatesTags: (_result, error, { id }) => (error ? [] : [
        { type: 'Task', id },
        { type: 'Task', id: 'LIST' },
      ]),
    }),
    deleteTask: build.mutation({
      query: (id) => ({
        url: `tasks/${encodeURIComponent(id)}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, error, id) => (error ? [] : [
        { type: 'Task', id },
        { type: 'Task', id: 'LIST' },
      ]),
    }),
  }),
})

export const {
  useGetTasksQuery,
  useGetTaskQuery,
  useAddTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = tasksApi

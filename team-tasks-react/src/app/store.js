import { configureStore } from '@reduxjs/toolkit'
import { usersReducer } from '../features/users/usersSlice'
import { usersMiddleware } from '../features/users/usersMiddleware'
import { uiReducer } from '../features/ui/uiSlice'
import { tasksApi } from '../services/tasksApi'

export const store = configureStore({
  reducer: {
    users: usersReducer,
    ui: uiReducer,
    [tasksApi.reducerPath]: tasksApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(usersMiddleware, tasksApi.middleware),
})

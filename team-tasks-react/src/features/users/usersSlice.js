import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  status: 'idle',
  error: null,
  requestId: null,
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    usersRequested() {
      // Action только сообщает о необходимости загрузки; эффект выполняет middleware.
    },
    usersLoading(state, { payload }) {
      if (typeof payload?.requestId !== 'string') return
      state.status = 'loading'
      state.error = null
      state.requestId = payload.requestId
    },
    usersLoaded(state, { payload }) {
      if (payload?.requestId !== state.requestId || !Array.isArray(payload.items)) return
      state.items = payload.items
      state.status = 'succeeded'
      state.error = null
    },
    usersFailed(state, { payload }) {
      if (payload?.requestId !== state.requestId) return
      state.status = 'failed'
      state.error = typeof payload.message === 'string' ? payload.message : 'Не удалось загрузить участников.'
    },
  },
})

export const { usersRequested, usersLoading, usersLoaded, usersFailed } = usersSlice.actions
export const usersReducer = usersSlice.reducer

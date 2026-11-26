import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    favoriteUserIds: [],
  },
  reducers: {
    toggleFavorite(state, { payload: userId }) {
      if (typeof userId !== 'string' || !userId.trim()) return
      const exists = state.favoriteUserIds.includes(userId)
      state.favoriteUserIds = exists
        ? state.favoriteUserIds.filter((id) => id !== userId)
        : [...state.favoriteUserIds, userId]
    },
  },
})

export const { toggleFavorite } = uiSlice.actions
export const uiReducer = uiSlice.reducer

export const selectFavoriteUserIds = (state) => state.ui.favoriteUserIds
export const selectFavoriteCount = (state) => state.ui.favoriteUserIds.length
export const selectFavoriteUsers = (state) =>
  state.users.items.filter((user) => state.ui.favoriteUserIds.includes(user.id))
export const selectIsFavorite = (state, userId) =>
  typeof userId === 'string' && state.ui.favoriteUserIds.includes(userId)

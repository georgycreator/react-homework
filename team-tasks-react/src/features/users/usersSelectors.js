export const selectUsers = (state) => state.users.items
export const selectUsersStatus = (state) => state.users.status
export const selectUsersError = (state) => state.users.error
export const selectUserById = (state, userId) =>
  state.users.items.find((user) => user.id === userId)

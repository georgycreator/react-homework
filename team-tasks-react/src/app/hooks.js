import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { usersRequested } from '../features/users/usersSlice'
import { selectUsersError, selectUsersStatus } from '../features/users/usersSelectors'

export function useEnsureUsersLoaded() {
  const dispatch = useDispatch()
  const status = useSelector(selectUsersStatus)
  const error = useSelector(selectUsersError)

  useEffect(() => {
    if (status === 'idle') dispatch(usersRequested())
  }, [dispatch, status])

  const retry = () => dispatch(usersRequested())
  return { status, error, retry }
}

export function getApiErrorMessage(error) {
  if (!error) return 'Неизвестная ошибка.'
  if (typeof error.data?.message === 'string') return error.data.message
  if (error.status === 'FETCH_ERROR') return 'Не удалось связаться с API. Проверьте, запущен ли сервер.'
  if (error.status === 'TIMEOUT_ERROR') return 'Сервер не ответил за 10 секунд. Проверьте API и повторите запрос.'
  if (error.status === 'PARSING_ERROR') return 'Сервер вернул ответ в неожиданном формате.'
  if (typeof error.status === 'number') return `Ошибка сервера: HTTP ${error.status}.`
  return 'Не удалось выполнить запрос. Попробуйте ещё раз.'
}

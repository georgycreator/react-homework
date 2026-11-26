import { Link, NavLink, Outlet, useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { useEnsureUsersLoaded } from '../app/hooks'
import { selectUserById, selectUsers } from '../features/users/usersSelectors'
import { selectIsFavorite, toggleFavorite } from '../features/ui/uiSlice'
import { Avatar } from '../components/Avatar'
import { ErrorState, LoadingState } from '../components/LoadingState'

export function UserLayout() {
  const { userId } = useParams()
  const dispatch = useDispatch()
  const users = useSelector(selectUsers)
  const user = useSelector((state) => selectUserById(state, userId))
  const isFavorite = useSelector((state) => selectIsFavorite(state, userId))
  const { status, error, retry } = useEnsureUsersLoaded()

  if ((status === 'idle' || status === 'loading') && users.length === 0) return <LoadingState>Загружаем профиль…</LoadingState>
  if (status === 'failed' && users.length === 0) return <ErrorState message={error} onRetry={retry} />
  if (!user) {
    return (
      <div className="not-found-panel">
        <span className="eyebrow">404 · УЧАСТНИК НЕ НАЙДЕН</span>
        <h1>Такого профиля нет</h1>
        <p>Проверьте ID участника или вернитесь к списку команды.</p>
        <Link to="/users" className="button button-primary">К участникам</Link>
      </div>
    )
  }

  return (
    <section>
      <div className="profile-banner">
        <div className="profile-person">
          <Avatar name={user.name} size="large" />
          <div>
            <p className="eyebrow">ПРОФИЛЬ УЧАСТНИКА</p>
            <h1>{user.name}</h1>
            <a className="profile-email" href={`mailto:${encodeURIComponent(user.email)}`}>{user.email}</a>
          </div>
        </div>
        <div className="profile-banner-actions">
          <button
            className={`profile-favorite ${isFavorite ? 'is-favorite' : ''}`}
            onClick={() => dispatch(toggleFavorite(user.id))}
            aria-pressed={isFavorite}
          >
            <span aria-hidden="true">{isFavorite ? '★' : '☆'}</span>
            {isFavorite ? 'В избранном' : 'В избранное'}
          </button>
          <span className="member-id">ID / {user.id}</span>
        </div>
      </div>

      <nav className="subnav" aria-label="Разделы участника">
        <NavLink end to={`/users/${userId}`} className={({ isActive }) => isActive ? 'subnav-link active' : 'subnav-link'}>Обзор</NavLink>
        <NavLink to={`/users/${userId}/tasks`} className={({ isActive }) => isActive ? 'subnav-link active' : 'subnav-link'}>Задачи</NavLink>
      </nav>
      <Outlet context={{ user }} />
    </section>
  )
}

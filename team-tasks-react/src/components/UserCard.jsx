import { Link } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { toggleFavorite, selectIsFavorite } from '../features/ui/uiSlice'
import { Avatar } from './Avatar'

export function UserCard({ user, compact = false }) {
  const dispatch = useDispatch()
  const isFavorite = useSelector((state) => selectIsFavorite(state, user.id))

  return (
    <article className={`user-card ${compact ? 'user-card-compact' : ''}`}>
      <Link to={`/users/${user.id}`} className="user-card-main">
        <Avatar name={user.name} />
        <span className="user-card-copy">
          <strong>{user.name}</strong>
          <span>{user.email}</span>
        </span>
      </Link>
      <div className="user-card-actions">
        <Link className="text-link" to={`/users/${user.id}`}>Профиль <span aria-hidden="true">→</span></Link>
        <button
          className={`favorite-button ${isFavorite ? 'is-favorite' : ''}`}
          onClick={() => dispatch(toggleFavorite(user.id))}
          aria-label={isFavorite ? `Убрать ${user.name} из избранного` : `Добавить ${user.name} в избранное`}
          aria-pressed={isFavorite}
          title={isFavorite ? 'Убрать из избранного' : 'В избранное'}
        >
          {isFavorite ? '★' : '☆'}
        </button>
      </div>
    </article>
  )
}

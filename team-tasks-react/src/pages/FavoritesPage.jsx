import { useSelector } from 'react-redux'
import { useEnsureUsersLoaded } from '../app/hooks'
import { selectFavoriteUsers } from '../features/ui/uiSlice'
import { UserCard } from '../components/UserCard'
import { EmptyState, ErrorState, LoadingState } from '../components/LoadingState'
import { Link } from 'react-router'

export function FavoritesPage() {
  const users = useSelector(selectFavoriteUsers)
  const { status, error, retry } = useEnsureUsersLoaded()

  if ((status === 'idle' || status === 'loading') && users.length === 0) return <LoadingState>Загружаем избранное…</LoadingState>
  if (status === 'failed' && users.length === 0) return <ErrorState message={error} onRetry={retry} />

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">БЫСТРЫЙ ДОСТУП</p>
          <h1>Избранные участники</h1>
          <p className="page-description">Здесь собраны профили, к которым вы хотите возвращаться чаще.</p>
        </div>
        <div className="heading-metric"><strong>{users.length.toString().padStart(2, '0')}</strong><span>в избранном</span></div>
      </div>
      {users.length === 0 ? (
        <EmptyState
          title="Пока никого нет в избранном"
          description="Нажмите на звёздочку в карточке участника, чтобы добавить его сюда."
          action={<Link className="button button-primary" to="/users">Открыть команду</Link>}
        />
      ) : (
        <div className="user-grid">
          {users.map((user) => <UserCard key={user.id} user={user} compact />)}
        </div>
      )}
    </section>
  )
}

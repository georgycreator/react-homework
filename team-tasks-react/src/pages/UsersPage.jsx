import { useSelector } from 'react-redux'
import { useEnsureUsersLoaded } from '../app/hooks'
import { selectUsers } from '../features/users/usersSelectors'
import { UserCard } from '../components/UserCard'
import { EmptyState, ErrorState, LoadingState } from '../components/LoadingState'

export function UsersPage() {
  const users = useSelector(selectUsers)
  const { status, error, retry } = useEnsureUsersLoaded()

  if ((status === 'idle' || status === 'loading') && users.length === 0) return <LoadingState>Загружаем команду…</LoadingState>
  if (status === 'failed' && users.length === 0) {
    return <ErrorState message={error} onRetry={retry} />
  }

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">РАБОЧЕЕ ПРОСТРАНСТВО</p>
          <h1>Участники команды</h1>
          <p className="page-description">Выберите участника, чтобы посмотреть профиль и его задачи.</p>
        </div>
        <div className="heading-metric"><strong>{users.length.toString().padStart(2, '0')}</strong><span>участника</span></div>
      </div>

      <div className="section-heading">
        <h2>Вся команда</h2>
        <span className="muted-label">{users.length} профиля</span>
      </div>
      {users.length === 0 ? (
        <EmptyState title="Участников пока нет" description="API вернул пустой список участников. Проверьте начальные данные." />
      ) : (
        <div className="user-grid">
          {users.map((user) => <UserCard key={user.id} user={user} />)}
        </div>
      )}
    </section>
  )
}

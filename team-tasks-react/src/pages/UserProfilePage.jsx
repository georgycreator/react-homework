import { Link, useOutletContext } from 'react-router'

export function UserProfilePage() {
  const { user } = useOutletContext()

  return (
    <div className="profile-overview">
      <div className="overview-card">
        <span className="card-kicker">ОБ УЧАСТНИКЕ</span>
        <h2>Контактная информация</h2>
        <div className="detail-row"><span>Имя</span><strong>{user.name}</strong></div>
        <div className="detail-row"><span>Электронная почта</span><strong>{user.email}</strong></div>
        <div className="detail-row"><span>Идентификатор</span><strong>{user.id}</strong></div>
      </div>
      <div className="overview-cta">
        <div className="cta-icon">↗</div>
        <div>
          <h2>Рабочие задачи</h2>
          <p>Посмотрите список задач участника, измените их статус или добавьте новую.</p>
          <Link to={`/users/${user.id}/tasks`} className="button button-primary">Перейти к задачам <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </div>
  )
}

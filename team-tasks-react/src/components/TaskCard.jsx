import { Link } from 'react-router'
import { StatusBadge } from './StatusBadge'

export function TaskCard({ task }) {
  return (
    <Link to={`/tasks/${task.id}`} className="task-card">
      <span className="task-card-indicator" />
      <span className="task-card-title">{task.title}</span>
      <StatusBadge status={task.status} />
      <span className="task-card-arrow" aria-hidden="true">↗</span>
    </Link>
  )
}

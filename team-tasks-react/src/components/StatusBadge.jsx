const STATUS_LABELS = {
  todo: 'К выполнению',
  doing: 'В работе',
  done: 'Готово',
}

export function StatusBadge({ status }) {
  return <span className={`status-badge status-${status}`}>{STATUS_LABELS[status] || status}</span>
}

export function statusLabel(status) {
  return STATUS_LABELS[status] || status
}

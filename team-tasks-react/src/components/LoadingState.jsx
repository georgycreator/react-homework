export function LoadingState({ children = 'Загружаем данные…' }) {
  return (
    <div className="state-panel" role="status">
      <span className="spinner" aria-hidden="true" />
      <span>{children}</span>
    </div>
  )
}

export function ErrorState({ title = 'Не удалось загрузить данные', message, onRetry }) {
  return (
    <div className="state-panel state-error" role="alert">
      <div className="state-icon">!</div>
      <div>
        <strong>{title}</strong>
        {message && <p>{message}</p>}
        {onRetry && <button type="button" className="button button-secondary button-small" onClick={onRetry}>Повторить</button>}
      </div>
    </div>
  )
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="state-panel state-empty">
      <div className="empty-symbol">○</div>
      <div>
        <strong>{title}</strong>
        {description && <p>{description}</p>}
        {action}
      </div>
    </div>
  )
}

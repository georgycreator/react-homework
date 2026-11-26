import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <div className="not-found-panel">
      <span className="eyebrow">404 · СТРАНИЦА НЕ НАЙДЕНА</span>
      <h1>Кажется, такой страницы нет</h1>
      <p>Проверьте адрес или перейдите к списку участников команды.</p>
      <Link to="/users" className="button button-primary">На главную</Link>
    </div>
  )
}

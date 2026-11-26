import { NavLink, Outlet } from 'react-router'
import { useSelector } from 'react-redux'
import { selectFavoriteCount } from '../features/ui/uiSlice'

export function AppLayout() {
  const favoriteCount = useSelector(selectFavoriteCount)

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <NavLink to="/users" className="brand" aria-label="Команда — главная">
            <span className="brand-mark">К</span>
            <span className="brand-copy">
              <strong>Команда</strong>
              <small>рабочее пространство</small>
            </span>
          </NavLink>
          <nav className="main-nav" aria-label="Основная навигация">
            <NavLink to="/users" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Участники
            </NavLink>
            <NavLink to="/favorites" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Избранное <span className="nav-count">{favoriteCount}</span>
            </NavLink>
          </nav>
          <div className="topbar-status"><span className="online-dot" /> Локальный проект</div>
        </div>
      </header>

      <main className="page-wrap">
        <Outlet />
      </main>

      <footer className="footer">
        <span>Учебный проект · React + Redux Toolkit</span>
        <span>Данные сохраняются в локальном API</span>
      </footer>
    </div>
  )
}

import { Navigate, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { useState } from "react";
import type { User } from "./types";
import { clearToken, getToken } from "./helpers/authStorage";
import { LoginPage } from "./pages/LoginPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ChatPage } from "./pages/ChatPage";

export function App() {
  const [token, setToken] = useState<string | null>(() => getToken());
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const handleLogin = (newToken: string, loggedInUser: User) => {
    setToken(newToken);
    setUser(loggedInUser);
    navigate("/chat", { replace: true });
  };

  const handleLogout = () => {
    clearToken();
    setToken(null);
    setUser(null);
    navigate("/login", { replace: true });
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <NavLink to={token ? "/chat" : "/login"} className="brand" aria-label="Messenger Mini — главная">
            <span className="brand-mark" aria-hidden="true">M</span>
            <span className="brand-wordmark">messenger<span>mini</span></span>
          </NavLink>

          <nav className="main-nav" aria-label="Основная навигация">
            {!token ? (
              <NavLink to="/login" className={({ isActive }) => `nav-link${isActive ? " nav-link-active" : ""}`}>
                Вход
              </NavLink>
            ) : (
              <>
                <NavLink to="/profile" className={({ isActive }) => `nav-link${isActive ? " nav-link-active" : ""}`}>
                  <span aria-hidden="true">◉</span> Профиль
                </NavLink>
                <NavLink to="/chat" className={({ isActive }) => `nav-link${isActive ? " nav-link-active" : ""}`}>
                  <span aria-hidden="true">▤</span> Чат
                </NavLink>
              </>
            )}
          </nav>

          <div className="topbar-actions">
            {token ? (
              <>
                <span className="user-chip"><span className="user-chip-dot" />{user?.nickname || "Вы вошли"}</span>
                <button className="button button-quiet logout-button" type="button" onClick={handleLogout}>Выйти <span aria-hidden="true">↗</span></button>
              </>
            ) : (
              <span className="topbar-note">Простое общение</span>
            )}
          </div>
        </div>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/login" element={token ? <Navigate to="/chat" replace /> : <LoginPage onLogin={handleLogin} />} />
          <Route path="/profile" element={token ? <ProfilePage token={token} /> : <Navigate to="/login" replace />} />
          <Route path="/chat" element={token ? <ChatPage token={token} /> : <Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to={token ? "/chat" : "/login"} replace />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <span>Messenger Mini</span>
        <span>Учебный проект на React + TypeScript</span>
      </footer>
    </div>
  );
}

export default App;

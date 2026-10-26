import { useState, type FormEvent } from "react";
import type { User } from "../types";
import { login } from "../api/authApi";
import { setToken } from "../helpers/authStorage";
import { handleError } from "../helpers/handleError";

type Props = {
  onLogin: (token: string, user: User) => void;
};

export function LoginPage({ onLogin }: Props) {
  const [phone, setPhone] = useState("+79990000000");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!phone.trim() || !password) {
      setError("Введите телефон и пароль.");
      return;
    }

    setLoading(true);
    try {
      const result = await login({ phone: phone.trim(), password });
      setToken(result.token);
      onLogin(result.token, result.user);
    } catch (loginError: unknown) {
      setError(handleError(loginError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-layout">
      <section className="login-intro">
        <div className="brand-mark brand-mark-large" aria-hidden="true">M</div>
        <p className="eyebrow eyebrow-light">MESSENGER MINI</p>
        <h2>Общайтесь.<br />Без лишнего.</h2>
        <p className="login-intro-copy">Учебный мессенджер с профилем, историей и сообщениями в реальном времени.</p>
        <div className="login-feature-list">
          <span><span aria-hidden="true">✓</span> Авторизация по телефону</span>
          <span><span aria-hidden="true">✓</span> Обновление профиля</span>
          <span><span aria-hidden="true">✓</span> Чат через WebSocket</span>
        </div>
      </section>

      <section className="login-panel card-surface">
        <span className="eyebrow">С РАДОСТЬЮ ВАС ВИДИМ</span>
        <h1>Вход в аккаунт</h1>
        <p className="muted-text">Введите данные тестового пользователя.</p>

        <form className="form-stack login-form" onSubmit={handleSubmit}>
          <label htmlFor="phone">Номер телефона</label>
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="username"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="+79990000000"
            required
          />

          <label htmlFor="password">Пароль</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Введите пароль"
            required
          />

          {error && <p className="notice notice-error" role="alert">{error}</p>}

          <button className="button button-primary button-full" type="submit" disabled={loading}>
            {loading ? "Входим…" : "Войти в мессенджер"}
            {!loading && <span aria-hidden="true">→</span>}
          </button>
        </form>

        <div className="demo-credentials">
          <strong>Тестовый доступ</strong>
          <span>Телефон: +79990000000</span>
          <span>Пароль: 123456</span>
          <span className="demo-hint">В архиве также есть ещё два тестовых аккаунта.</span>
        </div>
      </section>
    </div>
  );
}

export default LoginPage;

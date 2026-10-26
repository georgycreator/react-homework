const TOKEN_KEY = "messenger_token";

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string): void {
  if (!token.trim()) throw new Error("Нельзя сохранить пустой токен.");
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    throw new Error("Браузер не позволил сохранить токен. Проверьте настройки хранилища.");
  }
}

export function clearToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // При выходе очищаем состояние приложения даже если localStorage недоступен.
  }
}

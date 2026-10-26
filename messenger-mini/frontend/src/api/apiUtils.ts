export function getApiUrl(): string {
  return (import.meta.env.VITE_API_URL || "http://localhost:3001").replace(/\/$/, "");
}

export async function readJsonResponse<T>(response: Response): Promise<T> {
  const bodyText = await response.text();

  if (!bodyText.trim()) {
    if (response.status === 401) {
      throw new Error("Ошибка авторизации (401). Войдите в аккаунт повторно.");
    }
    if (!response.ok) {
      throw new Error(`Запрос завершился с ошибкой HTTP ${response.status}.`);
    }
    throw new Error("Сервер вернул пустой ответ вместо JSON.");
  }

  let data: unknown;
  try {
    data = JSON.parse(bodyText) as unknown;
  } catch {
    if (!response.ok) {
      throw new Error(response.status === 401
        ? "Ошибка авторизации (401). Войдите в аккаунт повторно."
        : `Запрос завершился с ошибкой HTTP ${response.status}.`);
    }
    throw new Error("Сервер вернул некорректный JSON.");
  }

  if (!response.ok) {
    const serverMessage = isRecord(data) && typeof data.message === "string"
      ? data.message
      : "";
    if (response.status === 401) {
      throw new Error(serverMessage
        ? `Ошибка авторизации (401): ${serverMessage}`
        : "Ошибка авторизации (401). Войдите в аккаунт повторно.");
    }
    throw new Error(serverMessage || `Запрос завершился с ошибкой HTTP ${response.status}.`);
  }

  return data as T;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

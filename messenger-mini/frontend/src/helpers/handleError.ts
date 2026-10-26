import axios from "axios";

export function handleError(error: unknown): string {
  if (typeof error === "string") return error;
  if (error instanceof Error && !axios.isAxiosError(error)) return error.message;

  if (axios.isAxiosError<{ message?: unknown }>(error)) {
    if (error.response?.status === 401) {
      const serverMessage = error.response.data?.message;
      return typeof serverMessage === "string"
        ? `Ошибка авторизации (401): ${serverMessage}`
        : "Сессия истекла или токен недействителен. Войдите снова.";
    }

    const serverMessage = error.response?.data?.message;
    if (typeof serverMessage === "string" && serverMessage.trim()) return serverMessage;
    if (error.code === "ERR_NETWORK") {
      return "Не удалось связаться с сервером. Запустите backend и проверьте адрес API.";
    }
    if (error.message) return error.message;
  }

  if (error && typeof error === "object" && "message" in error) {
    const message = error.message;
    if (typeof message === "string") return message;
  }

  return "Не удалось выполнить запрос. Попробуйте ещё раз.";
}

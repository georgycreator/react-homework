const DEFAULT_API_URL = 'http://127.0.0.1:3001'
const configuredApiUrl = import.meta.env.VITE_API_URL || DEFAULT_API_URL

function resolveApiUrl(value) {
  try {
    const parsed = new URL(value)
    if (
      ['http:', 'https:'].includes(parsed.protocol) &&
      !parsed.username &&
      !parsed.password &&
      parsed.pathname === '/' &&
      !parsed.search &&
      !parsed.hash
    ) {
      return parsed.toString().replace(/\/$/, '')
    }
  } catch {
    // Ошибку настройки сообщим в консоль и используем локальный адрес по умолчанию.
  }

  console.warn(`Некорректный VITE_API_URL. Используется ${DEFAULT_API_URL}.`)
  return DEFAULT_API_URL
}

export const API_BASE_URL = resolveApiUrl(configuredApiUrl)
export const API_REQUEST_TIMEOUT_MS = 10_000

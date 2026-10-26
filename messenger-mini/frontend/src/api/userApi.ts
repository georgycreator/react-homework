import axios from "axios";
import type { User } from "../types";
import { getApiUrl, readJsonResponse } from "./apiUtils";

const API_URL = getApiUrl();

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json"
  };
}

export async function getProfile(token: string): Promise<User> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}/users/me`, {
      method: "GET",
      headers: authHeaders(token)
    });
  } catch {
    throw new Error("Не удалось подключиться к серверу. Проверьте, запущен ли backend на порту 3001.");
  }

  const profile = await readJsonResponse<User>(response);
  if (!profile || typeof profile.id !== "string" || typeof profile.nickname !== "string" ||
      typeof profile.phone !== "string" || typeof profile.bio !== "string") {
    throw new Error("Сервер вернул профиль в неожиданном формате.");
  }
  return profile;
}

export type UpdateProfilePayload = Partial<Pick<User, "nickname" | "bio">>;

export async function updateProfile(
  token: string,
  { nickname, bio }: UpdateProfilePayload
): Promise<User> {
  const response = await axios.put<User>(`${API_URL}/users/me`, { nickname, bio }, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  });

  const profile = response.data;
  if (!profile || typeof profile.id !== "string" || typeof profile.nickname !== "string" ||
      typeof profile.phone !== "string" || typeof profile.bio !== "string") {
    throw new Error("Сервер вернул профиль в неожиданном формате.");
  }
  return profile;
}

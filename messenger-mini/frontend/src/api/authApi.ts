import axios from "axios";
import type { User } from "../types";
import { getApiUrl } from "./apiUtils";

const API_URL = getApiUrl();

export type LoginPayload = {
  phone: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: User;
};

export async function login({ phone, password }: LoginPayload): Promise<LoginResponse> {
  const response = await axios.post<LoginResponse>(`${API_URL}/auth/login`, {
    phone,
    password
  }, {
    headers: { "Content-Type": "application/json", Accept: "application/json" }
  });

  const data = response.data;
  if (!data || typeof data.token !== "string" || !data.token || !data.user) {
    throw new Error("Сервер вернул неполный ответ при входе.");
  }

  return data;
}

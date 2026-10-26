import axios from "axios";
import type { Message } from "../types";
import { getApiUrl, readJsonResponse } from "./apiUtils";

const API_URL = getApiUrl();

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json"
  };
}

export async function getMessages(token: string): Promise<Message[]> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}/messages`, {
      method: "GET",
      headers: authHeaders(token)
    });
  } catch {
    throw new Error("Не удалось загрузить сообщения: сервер недоступен.");
  }

  const messages = await readJsonResponse<Message[]>(response);
  if (!Array.isArray(messages)) {
    throw new Error("Сервер вернул историю сообщений в неожиданном формате.");
  }
  return messages;
}

export async function sendMessage(token: string, text: string): Promise<Message> {
  const response = await axios.post<Message>(`${API_URL}/messages`, { text }, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  });

  const message = response.data;
  if (!message || typeof message.id !== "string" || typeof message.text !== "string" ||
      typeof message.author !== "string" || typeof message.createdAt !== "string") {
    throw new Error("Сервер вернул созданное сообщение в неожиданном формате.");
  }
  return message;
}

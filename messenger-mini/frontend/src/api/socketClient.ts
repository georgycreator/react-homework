import type { Message } from "../types";
import { isRecord } from "./apiUtils";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:3001";

type SocketCallbacks = {
  onMessage?: (message: Message) => void;
  onStatus?: (status: string) => void;
  onError?: (message: string) => void;
};

type SocketClient = {
  sendMessage: (text: string) => void;
  disconnect: () => void;
};

function isMessage(value: unknown): value is Message {
  return isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.userId === "string" &&
    typeof value.author === "string" &&
    typeof value.text === "string" &&
    typeof value.createdAt === "string";
}

export function connectSocket(
  token: string,
  { onMessage, onStatus, onError }: SocketCallbacks = {}
): SocketClient {
  let socket: WebSocket;
  try {
    socket = new WebSocket(WS_URL);
  } catch {
    onStatus?.("disconnected");
    onError?.("Не удалось создать WebSocket-соединение.");
    return {
      sendMessage: () => { throw new Error("WebSocket-соединение не создано."); },
      disconnect: () => undefined
    };
  }

  onStatus?.("connecting");

  socket.addEventListener("open", () => onStatus?.("connected"));
  socket.addEventListener("close", () => onStatus?.("disconnected"));
  socket.addEventListener("error", () => {
    onStatus?.("disconnected");
    onError?.("Ошибка WebSocket-соединения. Проверьте, запущен ли сервер.");
  });
  socket.addEventListener("message", (event: MessageEvent) => {
    let decoded: unknown;
    try {
      decoded = JSON.parse(String(event.data)) as unknown;
    } catch {
      onError?.("WebSocket вернул некорректный JSON.");
      return;
    }

    if (!isRecord(decoded) || typeof decoded.type !== "string") return;

    if (decoded.type === "message:new" && isMessage(decoded.payload)) {
      onMessage?.(decoded.payload);
      return;
    }

    if (decoded.type === "error") {
      const message = typeof decoded.payload === "string"
        ? decoded.payload
        : "Сервер сообщил об ошибке WebSocket.";
      onError?.(message);
    }
  });

  return {
    sendMessage(text: string) {
      if (socket.readyState !== WebSocket.OPEN) {
        throw new Error("WebSocket не подключён. Сообщение не отправлено.");
      }
      const cleanText = text.trim();
      if (!cleanText) throw new Error("Нельзя отправить пустое сообщение.");
      socket.send(JSON.stringify({
        type: "message:send",
        payload: { text: cleanText, token }
      }));
    },
    disconnect() {
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close();
      }
    }
  };
}

import { useEffect, useRef, useState } from "react";
import type { Message } from "../types";
import { getMessages, sendMessage } from "../api/messageApi";
import { connectSocket } from "../api/socketClient";
import { handleError } from "../helpers/handleError";
import { MessageList } from "../components/MessageList";
import { MessageInput } from "../components/MessageInput";

type Props = {
  token: string;
};

type SocketClient = ReturnType<typeof connectSocket>;

function mergeMessages(current: Message[], incoming: Message | Message[]): Message[] {
  const next = new Map<string, Message>();
  current.forEach((message) => next.set(message.id, message));
  (Array.isArray(incoming) ? incoming : [incoming]).forEach((message) => next.set(message.id, message));
  return [...next.values()].sort((a, b) => {
    const aTime = Date.parse(a.createdAt);
    const bTime = Date.parse(b.createdAt);
    return (Number.isNaN(aTime) ? 0 : aTime) - (Number.isNaN(bTime) ? 0 : bTime);
  });
}

export function ChatPage({ token }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [socketStatus, setSocketStatus] = useState("connecting");
  const socketRef = useRef<SocketClient | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    getMessages(token)
      .then((history) => {
        if (active) setMessages((current) => mergeMessages(current, history));
      })
      .catch((loadError: unknown) => {
        if (active) setError(handleError(loadError));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    const socket = connectSocket(token, {
      onMessage: (message) => {
        if (active) setMessages((current) => mergeMessages(current, message));
      },
      onStatus: (status) => {
        if (active) setSocketStatus(status);
      },
      onError: (message) => {
        if (active) setError(message);
      }
    });
    socketRef.current = socket;

    return () => {
      active = false;
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  const handleSend = async (text: string): Promise<boolean> => {
    setError("");
    setSending(true);
    try {
      // HTTP POST создаёт сообщение. Сервер рассылает его всем подключённым клиентам по WebSocket.
      // Благодаря mergeMessages событие сокета и ответ POST не добавят одно сообщение дважды.
      const message = await sendMessage(token, text);
      setMessages((current) => mergeMessages(current, message));
      return true;
    } catch (sendError: unknown) {
      // Если REST-запрос завершился ошибкой, пробуем поддерживаемый сервером WS-протокол.
      // При успехе сервер сам рассылает событие message:new всем участникам.
      try {
        if (socketStatus !== "connected" || !socketRef.current) throw sendError;
        socketRef.current.sendMessage(text);
        return true;
      } catch (socketError: unknown) {
        setError(handleError(socketError));
        return false;
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="page-section chat-page">
      <div className="page-heading chat-heading">
        <div>
          <span className="eyebrow">ОБЩЕЕ ПРОСТРАНСТВО</span>
          <h1>Общий чат</h1>
          <p className="muted-text">Сообщения доступны всем трём тестовым пользователям.</p>
        </div>
        <div className="socket-indicator">
          <span className={`status-dot status-${socketStatus}`} />
          <span>{socketStatus === "connected" ? "В сети" : socketStatus === "connecting" ? "Подключение…" : "Нет соединения"}</span>
        </div>
      </div>

      {error && <p className="notice notice-error" role="alert">{error}</p>}

      <section className="chat-card card-surface" aria-label="Общий чат">
        <div className="chat-card-topline">
          <div className="chat-room-avatar" aria-hidden="true">#</div>
          <div>
            <strong>Знакомства и общение</strong>
            <p>{messages.length} {messages.length === 1 ? "сообщение" : messages.length > 1 && messages.length < 5 ? "сообщения" : "сообщений"}</p>
          </div>
          <span className="live-label"><span className={`status-dot status-${socketStatus}`} /> LIVE</span>
        </div>

        <div className="chat-history" aria-live="polite" aria-busy={loading}>
          {loading && messages.length === 0 ? (
            <div className="loading-state"><span className="spinner" /> Загружаем историю…</div>
          ) : (
            <MessageList messages={messages} />
          )}
        </div>

        <div className="chat-composer-area">
          {socketStatus !== "connected" && (
            <p className="composer-hint">Отправка станет доступна после подключения к серверу.</p>
          )}
          <MessageInput onSend={handleSend} disabled={socketStatus !== "connected" || sending} />
        </div>
      </section>

      <p className="chat-footnote"><span aria-hidden="true">🔒</span> Соединение использует ваш токен авторизации. Не передавайте его другим людям.</p>
    </section>
  );
}

export default ChatPage;

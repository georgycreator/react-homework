import type { Message } from "../types";

type Props = {
  messages: Message[];
  currentUserId?: string;
};

function formatTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

export function MessageList({ messages, currentUserId }: Props) {
  if (!messages.length) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon" aria-hidden="true">✉</div>
        <strong>Пока тихо</strong>
        <p>Отправьте первое сообщение — оно появится здесь.</p>
      </div>
    );
  }

  return (
    <ol className="message-list" aria-label="История сообщений">
      {messages.map((message) => {
        const ownMessage = Boolean(currentUserId && message.userId === currentUserId);
        return (
          <li className={`message-row${ownMessage ? " message-row-own" : ""}`} key={message.id}>
            <article className={`message-bubble${ownMessage ? " message-bubble-own" : ""}`}>
              <div className="message-meta">
                <span className="message-author">{message.author}</span>
                <time dateTime={message.createdAt}>{formatTime(message.createdAt)}</time>
              </div>
              <p>{message.text}</p>
            </article>
          </li>
        );
      })}
    </ol>
  );
}

export default MessageList;

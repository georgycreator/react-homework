import { useState, type FormEvent } from "react";

type Props = {
  onSend: (text: string) => void | boolean | Promise<void | boolean>;
  disabled?: boolean;
};

export function MessageInput({ onSend, disabled = false }: Props) {
  const [text, setText] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanText = text.trim();
    if (!cleanText || disabled) return;

    // Не очищаем поле, если отправка не удалась: пользователь сможет повторить попытку.
    const sent = await onSend(cleanText);
    if (sent !== false) setText("");
  };

  return (
    <form className="message-composer" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="message-text">Текст сообщения</label>
      <input
        id="message-text"
        type="text"
        placeholder="Напишите сообщение…"
        value={text}
        onChange={(event) => setText(event.target.value)}
        disabled={disabled}
        maxLength={2000}
        autoComplete="off"
      />
      <button className="button button-primary send-button" type="submit" disabled={disabled || !text.trim()}>
        Отправить <span aria-hidden="true">↗</span>
      </button>
    </form>
  );
}

export default MessageInput;

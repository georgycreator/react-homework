import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";

// StrictMode намеренно не используется: в dev-режиме он вызывает рендер
// дважды, и в консоли была бы не одна, а две строки "render" на клик.
createRoot(document.getElementById("root")).render(<App />);

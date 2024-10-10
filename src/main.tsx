import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { insertCoin } from "playroomkit";
import "./index.css";

insertCoin({
  skipLobby: false,
  gameId: import.meta.env.VITE_GAME_ID,
  discord: true,
}).then(() =>
  createRoot(document.getElementById("root") as HTMLElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
);

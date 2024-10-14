import { useContext } from "react";

import { GameStateContext } from "./game-state-provider";

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error("useGameState must be used within a GameStateProvider");
  }
  return context;
};

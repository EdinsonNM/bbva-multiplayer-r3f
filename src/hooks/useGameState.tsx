import { Joystick, isHost, onPlayerJoin } from "playroomkit";
import { createContext, useContext, useEffect, useRef, useState } from "react";

const GameStateContext = createContext();

const NEXT_STAGE = {
  lobby: "countdown",
  countdown: "game",
  game: "winner",
  winner: "lobby",
};

const TIMER_STAGE = {
  lobby: -1,
  countdown: 3,
  game: 0,
  winner: 5,
};

export const GameStateProvider = ({ children }) => {
  const [players, setPlayers] = useState([]);
  const [soloGame, setSoloGame] = useState(false);

  const host = isHost();
  const isInit = useRef(false);
  useEffect(() => {
    if (isInit.current) {
      return;
    }
    isInit.current = true;
    onPlayerJoin((state) => {
      const controls = new Joystick(state, {
        type: "angular",
        buttons: [{ id: "Jump", label: "Jump" }],
      });
      const newPlayer = { state, controls };

      setPlayers((players) => [...players, newPlayer]);
      state.onQuit(() => {
        setPlayers((players) => players.filter((p) => p.state.id !== state.id));
      });
    });
  }, []);

  return (
    <GameStateContext.Provider
      value={{
        players,
        host,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error("useGameState must be used within a GameStateProvider");
  }
  return context;
};

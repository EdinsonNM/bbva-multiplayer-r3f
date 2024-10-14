import { Joystick, PlayerState, isHost, onPlayerJoin } from "playroomkit";
import { createContext, useEffect, useRef, useState } from "react";

type GameState = {
  players: Player[];
  host: boolean;
} | null;

export const GameStateContext = createContext<GameState>(null);

type Player = {
  state: PlayerState;
  controls: Joystick;
};
export const GameStateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [players, setPlayers] = useState<Player[]>([]);

  const host = isHost();
  const isInit = useRef(false);
  useEffect(() => {
    if (isInit.current) {
      return;
    }
    isInit.current = true;
    onPlayerJoin((state) => {
      const randomX = Math.random() * (10 - 5) + 5;
      const randomY = Math.random() * (10 - 5) + 5;
      const randomZ = Math.random() * (10 - 5) + 5; // Si es 3D
      state.setState("pos", { x: randomX, y: randomY, z: randomZ });
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
      <div className="fixed top-0 left-0 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-md m-4">
        N° of players: {players.length}
      </div>
    </GameStateContext.Provider>
  );
};

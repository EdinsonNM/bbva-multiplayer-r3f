import { myPlayer } from "playroomkit";
import { useGameState } from "./hooks/use-game-state";
import { CharacterController } from "./CharacterController";

export const Experience = () => {
  const { players } = useGameState();
  const me = myPlayer();

  return (
    <>
      {players.map(({ state, controls }) => (
        <CharacterController
          key={state.id}
          state={state}
          controls={controls}
          player={me.id === state.id}
          position-y={2}
        />
      ))}
    </>
  );
};

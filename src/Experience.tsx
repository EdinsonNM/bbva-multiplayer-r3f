import { useThree } from "@react-three/fiber";
import { myPlayer } from "playroomkit";
import { useGameState } from "./hooks/useGameState";
import { CharacterController } from "./CharacterController";

export const Experience = () => {
  const { players, stage } = useGameState();
  const me = myPlayer();
  const camera = useThree((state) => state.camera);

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

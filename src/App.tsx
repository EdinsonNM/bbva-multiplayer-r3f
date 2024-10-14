import "./App.css";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  KeyboardControls,
  OrbitControls,
} from "@react-three/drei";
import Bbva from "./bbva";
import { useMemo } from "react";
import { AudioManagerProvider } from "./hooks/useAudioManager";
import { GameStateProvider } from "./hooks/game-state-provider";
import { Experience } from "./Experience";
import { Physics, RigidBody } from "@react-three/rapier";
import { DoubleSide } from "three";
import { Buildings } from "./buildings";

export const Controls = {
  forward: "forward",
  back: "back",
  left: "left",
  right: "right",
  jump: "jump",
};

function App() {
  const map = useMemo(
    () => [
      { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
      { name: Controls.back, keys: ["ArrowDown", "KeyS"] },
      { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
      { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
      { name: Controls.jump, keys: ["Space"] },
    ],
    []
  );
  return (
    <KeyboardControls map={map}>
      <AudioManagerProvider>
        <GameStateProvider>
          <div className="w-screen h-screen bg-white bg-gradient-to-b from-orange-500 to-white">
            <Canvas
              className="w-screen h-screen"
              camera={{ position: [0, 1, 8], fov: 75 }}
            >
              <Physics>
                <fog attach="fog" color="#fff" near={10} far={100} />
                <hemisphereLight
                  intensity={1}
                  position={[0, 4, 0]}
                  color="#f97316"
                  groundColor="cyan"
                />
                <OrbitControls />
                <Environment preset="sunset" />
                <Bbva />
                <Experience />
                <RigidBody type="fixed" position={[0, -0.1, 0]}>
                  <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[500, 500]} />
                    <meshBasicMaterial color="#C4D0E2" side={DoubleSide} />
                  </mesh>
                </RigidBody>
                <Buildings />
              </Physics>
            </Canvas>
          </div>
        </GameStateProvider>
      </AudioManagerProvider>
    </KeyboardControls>
  );
}

export default App;

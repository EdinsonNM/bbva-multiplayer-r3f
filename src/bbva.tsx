import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

export default function Bbva() {
  const { scene } = useGLTF("/models/bbva.gltf", "draco/gltf/");
  return (
    <RigidBody
      position={[0, 0, 0]}
      type="fixed"
      colliders="trimesh"
      name="bbva"
    >
      <primitive object={scene} />
    </RigidBody>
  );
}
useGLTF.preload("/models/bbva.gltf", "draco/gltf/", true);

import { useRef } from "react";
import { Noise } from "noisejs";
import { DoubleSide } from "three";

const noise = new Noise(Math.random());
const Terrain = () => {
  const meshRef = useRef();

  const modifyVertices = (geometry) => {
    const position = geometry.attributes.position;
    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const z = position.getZ(i); // En este caso, mantenemos X y Z como plano
      // Modificar la coordenada Y usando el ruido
      const y = noise.simplex2(x * 10, z * 10) * 2; // Ajustar escala del ruido
      position.setY(i, y);
    }
    position.needsUpdate = true; // Necesario para aplicar cambios
  };

  return (
    <mesh ref={meshRef}>
      <planeGeometry
        args={[10, 10, 50, 50]}
        attach="geometry"
        ref={(ref) => ref && modifyVertices(ref)}
      />
      <meshStandardMaterial color="red" side={DoubleSide} />
    </mesh>
  );
};

export default Terrain;

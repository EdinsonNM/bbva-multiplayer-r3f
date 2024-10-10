import { useMemo } from "react";

import { Noise } from "noisejs";
import { Box } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
const noise = new Noise(Math.random());

export const Buildings = () => {
  const maxRange = 90; // Radio máximo
  const minRange = 4.5; // Radio mínimo
  const numBuildings = 1800; // Cantidad de edificios
  const minHeight = 0.5; // Altura mínima
  const maxHeight = 3; // Altura máxima
  const cellSize = 0.5; // Tamaño de cada celda (tamaño del edificio)
  const blockSize = 5; // Tamaño del bloque (grupo de edificios)
  const streetSize = 2; // Tamaño de las calles entre bloques

  const buildingPositions = useMemo(() => {
    const positions = [];

    for (let i = 0; i < numBuildings; i++) {
      // Generar una posición aleatoria dentro del rango de cuadrícula
      const x =
        Math.round((Math.random() * maxRange - maxRange / 2) / cellSize) *
        cellSize;
      const z =
        Math.round((Math.random() * maxRange - maxRange / 2) / cellSize) *
        cellSize;

      // Verificar si la posición está dentro de un bloque (es decir, no en la calle)
      const isInBlockX = Math.abs(x % (blockSize + streetSize)) < blockSize;
      const isInBlockZ = Math.abs(z % (blockSize + streetSize)) < blockSize;

      if (!isInBlockX || !isInBlockZ) {
        continue; // Si está en una calle, no generar un edificio
      }

      // Calcular la distancia desde el origen (0, 0)
      const distance = Math.sqrt(x * x + z * z);

      // Verificar si la distancia está dentro del rango mínimo y máximo
      if (distance < minRange || distance > maxRange) {
        continue; // Si está fuera del rango, saltar esta iteración
      }

      // Obtener el valor del ruido y normalizarlo a un rango [0, 1]
      const noiseValue = (noise.perlin2(x / 10, z / 10) + 1) / 2;

      // Escalar el valor del ruido para que esté entre minHeight y maxHeight
      const height = minHeight + (maxHeight - minHeight) * noiseValue;

      positions.push({ x, z, height });
    }

    return positions;
  }, [
    numBuildings,
    minRange,
    maxRange,
    minHeight,
    maxHeight,
    cellSize,
    blockSize,
    streetSize,
  ]);

  return (
    <>
      {buildingPositions.map(({ x, z, height }, index) => (
        <RigidBody key={index}>
          <Box args={[0.5, height, 0.5]} position={[x, height / 2, z]}>
            <meshStandardMaterial color="WHITE" />
          </Box>
        </RigidBody>
      ))}
    </>
  );
};

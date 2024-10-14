import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  CapsuleCollider,
  RigidBody,
  RigidBodyProps,
  euler,
  quat,
} from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import { Group, Vector3 } from "three";

import { Character } from "./Character";
import { Controls } from "./App";
import { Joystick } from "playroomkit";

const MOVEMENT_SPEED = 4.2;
const JUMP_FORCE = 8;
const ROTATION_SPEED = 2.5;
const vel = new Vector3();

type CharacterControllerProps = {
  player?: boolean;
  controls: Joystick;
  state: any;
};
export const CharacterController = ({
  player = false,
  controls,
  state,
  ...props
}: CharacterControllerProps & RigidBodyProps) => {
  const [animation, setAnimation] = useState("idle");
  const [, get] = useKeyboardControls();
  const rb = useRef<any>(null);
  const inTheAir = useRef(true);
  const landed = useRef(false);
  const cameraPosition = useRef<Group>(null);
  const [initialPos, setInitialPos] = useState<{
    x: number;
    y: number;
    z: number;
  }>({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    const pos = state.getState("pos");
    if (pos) {
      setInitialPos(pos);
    } else {
      // Si no hay posición en el estado, establecer una por defecto o esperar
      setInitialPos({ x: 0, y: 0, z: 0 });
    }
  }, [state]);

  useFrame(() => {
    if (!rb.current) return;
    if (!player) {
      const pos = state.getState("pos");
      if (pos) {
        (rb.current as any).setTranslation(pos);
      }
      const rot = state.getState("rot");
      if (rot) {
        (rb.current as any).setRotation(rot);
      }
      const anim = state.getState("animation");
      setAnimation(anim);
      return;
    }

    const rotVel = {
      x: 0,
      y: 0,
      z: 0,
    };

    const curVel = (rb.current as any).linvel();
    vel.x = 0;
    vel.y = 0;
    vel.z = 0;

    const angle = controls.angle();
    const joystickX = Math.sin(angle);
    const joystickY = Math.cos(angle);

    if (
      get()[Controls.forward] ||
      (controls.isJoystickPressed() && joystickY < -0.1)
    ) {
      vel.z += MOVEMENT_SPEED;
    }
    if (
      get()[Controls.back] ||
      (controls.isJoystickPressed() && joystickY > 0.1)
    ) {
      vel.z -= MOVEMENT_SPEED;
    }
    if (
      get()[Controls.left] ||
      (controls.isJoystickPressed() && joystickX < -0.1)
    ) {
      rotVel.y += ROTATION_SPEED;
    }
    if (
      get()[Controls.right] ||
      (controls.isJoystickPressed() && joystickX > 0.1)
    ) {
      rotVel.y -= ROTATION_SPEED;
    }

    (rb.current as any).setAngvel(rotVel);
    // apply rotation to x and z to go in the right direction
    const eulerRot = euler().setFromQuaternion(
      quat((rb.current as any).rotation())
    );
    vel.applyEuler(eulerRot);
    if (
      get()[Controls.jump] ||
      (controls.isPressed("Jump") && !inTheAir.current && landed.current)
    ) {
      vel.y += JUMP_FORCE;
      inTheAir.current = true;
      landed.current = false;
    } else {
      vel.y = curVel.y;
    }

    if (Math.abs(vel.y) > 1) {
      inTheAir.current = true;
      landed.current = false;
    } else {
      inTheAir.current = false;
      landed.current = true;
    }
    (rb.current as any).setLinvel(vel);
    state.setState("pos", (rb.current as any).translation());
    state.setState("rot", (rb.current as any).rotation());

    // ANIMATION
    const movement = Math.abs(vel.x) + Math.abs(vel.z);
    if (inTheAir.current && vel.y > 2) {
      setAnimation("jump_up");
      state.setState("animation", "jump_up");
    } else if (inTheAir.current && vel.y < -5) {
      setAnimation("fall");
      state.setState("animation", "fall");
    } else if (movement > 1 || inTheAir.current) {
      setAnimation("run");
      state.setState("animation", "run");
    } else {
      setAnimation("idle");
      state.setState("animation", "idle");
    }
  });

  return (
    <RigidBody
      position={[initialPos.x, initialPos.y, initialPos.z]}
      {...props}
      colliders={false}
      canSleep={false}
      enabledRotations={[false, true, false]}
      ref={rb}
      onCollisionEnter={(e) => {
        if (e.other.rigidBodyObject?.name === "bbva") {
          inTheAir.current = false;
          landed.current = true;
          const curVel = (rb.current as any).linvel();
          curVel.y = 0;
          (rb.current as any).setLinvel(curVel);
        }
      }}
      gravityScale={2.5}
      name={player ? "player" : "other"}
    >
      <group ref={cameraPosition} position={[0, 8, -16]}></group>
      <Character
        scale={0.42}
        color={state.state.profile.color}
        name={state.state.profile.name}
        position-y={0.2}
        animation={animation}
      />
      <CapsuleCollider args={[0.1, 0.38]} position={[0, 0.68, 0]} />
    </RigidBody>
  );
};

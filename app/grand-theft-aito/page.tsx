"use client";

import React, { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { create } from "zustand";
import Link from "next/link";

interface GameState {
  isDriving: boolean;
  setDriving: (driving: boolean) => void;
  canEnterCar: boolean;
  setCanEnterCar: (canEnter: boolean) => void;
}

const useStore = create<GameState>((set) => ({
  isDriving: false,
  setDriving: (driving) => set({ isDriving: driving }),
  canEnterCar: false,
  setCanEnterCar: (canEnter) => set({ canEnterCar: canEnter }),
}));

const Character = ({ characterRef, isVisible }: { characterRef: React.RefObject<THREE.Group>; isVisible: boolean }) => {
  const speed = 0.1;
  const { isDriving } = useStore();

  useFrame(() => {
    if (!isDriving && isVisible) {
      const { forward, backward, left, right } = keysPressed;
      if (forward) characterRef.current!.position.z -= speed;
      if (backward) characterRef.current!.position.z += speed;
      if (left) characterRef.current!.position.x -= speed;
      if (right) characterRef.current!.position.x += speed;
    }
  });

  return (
    isVisible && (
      <group ref={characterRef}>
        <mesh position={[0, 1, 0]}>
          <boxGeometry args={[1, 2, 1]} />
          <meshStandardMaterial color={"orange"} />
        </mesh>
      </group>
    )
  );
};

const Car = ({ characterRef }: { characterRef: React.RefObject<THREE.Group> }) => {
    const ref = useRef<THREE.Group>(null!);
    const { isDriving, setDriving, setCanEnterCar } = useStore();
    const carSpeed = 0.2;
  
    useFrame(() => {
      if (isDriving) {
        const { forward, backward, left, right } = keysPressed;
        if (forward) ref.current.position.z -= carSpeed;
        if (backward) ref.current.position.z += carSpeed;
        if (left) ref.current.position.x -= carSpeed;
        if (right) ref.current.position.x += carSpeed;
      }
    });
  
    useEffect(() => {
      const checkProximity = () => {
        if (characterRef.current) {
          const charPos = new THREE.Vector3();
          characterRef.current.getWorldPosition(charPos);
  
          const carPos = new THREE.Vector3();
          ref.current.getWorldPosition(carPos);
  
          if (charPos.distanceTo(carPos) < 2 && !isDriving) {
            setCanEnterCar(true);
          } else {
            setCanEnterCar(false);
          }
        }
      };
  
      const interval = setInterval(checkProximity, 100);
      return () => clearInterval(interval);
    }, [isDriving, characterRef, setCanEnterCar]);
  
    return (
      <group ref={ref} position={[3, 0, -5]}>
        {/* Main body of the car */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[2, 1, 4]} />
          <meshStandardMaterial color={"blue"} />
        </mesh>
  
        {/* Cabin of the car */}
        <mesh position={[0, 1.25, 0]}>
          <boxGeometry args={[1.5, 0.75, 2]} />
          <meshStandardMaterial color={"lightblue"} />
        </mesh>
  
        {/* Front hood or bumper */}
        <mesh position={[0, 0.25, 1.5]}>
          <boxGeometry args={[1.75, 0.5, 1]} />
          <meshStandardMaterial color={"darkblue"} />
        </mesh>
      </group>
    );
  };
  

const keysPressed: Record<string, boolean> = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  interact: false,
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === "w" || e.key === "ArrowUp") keysPressed.forward = true;
  if (e.key === "s" || e.key === "ArrowDown") keysPressed.backward = true;
  if (e.key === "a" || e.key === "ArrowLeft") keysPressed.left = true;
  if (e.key === "d" || e.key === "ArrowRight") keysPressed.right = true;
  if (e.key === "e") keysPressed.interact = true;
};

const handleKeyUp = (e: KeyboardEvent) => {
  if (e.key === "w" || e.key === "ArrowUp") keysPressed.forward = false;
  if (e.key === "s" || e.key === "ArrowDown") keysPressed.backward = false;
  if (e.key === "a" || e.key === "ArrowLeft") keysPressed.left = false;
  if (e.key === "d" || e.key === "ArrowRight") keysPressed.right = false;
  if (e.key === "e") keysPressed.interact = false;
};

const Scene = () => {
  const characterRef = useRef<THREE.Group>(null!);
  const { isDriving } = useStore(); // Fetch isDriving from the store here

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
      <Character characterRef={characterRef} isVisible={!isDriving} />
      <Car characterRef={characterRef} />
    </>
  );
};

// On-screen arrow controls with the "Enter Car" and "Exit Car" button
const ArrowControls = () => {
  const { canEnterCar, isDriving, setDriving } = useStore();

  const handleMouseDown = (direction: keyof typeof keysPressed) => {
    keysPressed[direction] = true;
  };

  const handleMouseUp = (direction: keyof typeof keysPressed) => {
    keysPressed[direction] = false;
  };

  const toggleCarState = () => {
    setDriving(!isDriving);
  };

  return (
    <div className="absolute bottom-10 left-10 space-y-2">
      <div
        className="bg-gray-300 p-2 rounded-full text-center cursor-pointer"
        style={{ color: "black" }}
        onMouseDown={() => handleMouseDown("forward")}
        onMouseUp={() => handleMouseUp("forward")}
      >
        ↑
      </div>
      <div className="flex space-x-2">
        <div
          className="bg-gray-300 p-2 rounded-full text-center cursor-pointer"
          style={{ color: "black" }}
          onMouseDown={() => handleMouseDown("left")}
          onMouseUp={() => handleMouseUp("left")}
        >
          ←
        </div>
        <div
          className="bg-gray-300 p-2 rounded-full text-center cursor-pointer"
          style={{ color: "black" }}
          onMouseDown={() => handleMouseDown("backward")}
          onMouseUp={() => handleMouseUp("backward")}
        >
          ↓
        </div>
        <div
          className="bg-gray-300 p-2 rounded-full text-center cursor-pointer"
          style={{ color: "black" }}
          onMouseDown={() => handleMouseDown("right")}
          onMouseUp={() => handleMouseUp("right")}
        >
          →
        </div>
      </div>
      {canEnterCar && (
        <div
          className={`bg-${isDriving ? "red" : "green"}-600 p-2 mt-2 rounded-full text-center cursor-pointer text-white`}
          onClick={toggleCarState}
        >
          {isDriving ? "Exit Car" : "Enter Car"}
        </div>
      )}
    </div>
  );
};

export default function Page() {
  return (
    <div className="relative w-screen h-screen bg-black text-white">
      <Link href="/" legacyBehavior>
        <a className="absolute top-4 left-4 z-50 text-white bg-blue-600 px-4 py-2 rounded-md">
          &lt; o1-games
        </a>
      </Link>
      <Link href="https://chatgpt.com/share/66f9957a-def4-8002-b77b-0f165e0b5fa3" legacyBehavior>
        <a className="absolute top-4 right-32 z-50 text-white bg-gray-700 px-4 py-2 rounded-md">
          o1 chat history
        </a>
      </Link>
      <Link href="https://github.com/gaborcselle/o1-games" legacyBehavior>
        <a className="absolute top-4 right-4 z-50 text-white bg-gray-700 px-4 py-2 rounded-md">
          GitHub Repo
        </a>
      </Link>
      <h1 className="absolute top-4 left-1/2 transform -translate-x-1/2 text-3xl font-bold tracking-widest z-40">
        Grand Theft Aito
      </h1>
      <Canvas shadows camera={{ position: [0, 5, 10], fov: 60 }}>
        <PerspectiveCamera makeDefault position={[0, 10, 10]} />
        <OrbitControls enableZoom={true} /> {/* Ensure enableZoom is set to true */}
        <Scene />
        <gridHelper args={[100, 100, "gray", "gray"]} />
    </Canvas>
      <ArrowControls />
    </div>
  );
}

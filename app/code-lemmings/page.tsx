"use client";

import React, { useEffect, useState } from "react";

interface Lemming {
  id: number;
  x: number;
  y: number;
  direction: number;
  isFalling: boolean;
}

const LEMMING_SIZE = 20;
const GAME_WIDTH = 600;
const GAME_HEIGHT = 400;

const GamePage: React.FC = () => {
  const [lemmings, setLemmings] = useState<Lemming[]>([]);
  const [savedLemmings, setSavedLemmings] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWin, setGameWin] = useState(false);
  const [spawnCount, setSpawnCount] = useState(0);

  const totalLemmings = 10;

  useEffect(() => {
    if (spawnCount < totalLemmings) {
      const spawnInterval = setInterval(() => {
        setLemmings((prev) => [
          ...prev,
          {
            id: Date.now(),
            x: 0,
            y: 0,
            direction: 1,
            isFalling: true,
          },
        ]);
        setSpawnCount((prev) => prev + 1);
      }, 1000);

      return () => clearInterval(spawnInterval);
    }
  }, [spawnCount]);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      setLemmings((prevLemmings) =>
        prevLemmings
          .map((lemming) => {
            let { x, y, direction, isFalling } = lemming;

            if (y + LEMMING_SIZE < GAME_HEIGHT - 20 && isFalling) {
              y += 2;
            } else {
              y = GAME_HEIGHT - 20 - LEMMING_SIZE;
              isFalling = false;
              x += direction * 1;

              if (x <= 0 || x + LEMMING_SIZE >= GAME_WIDTH) {
                direction *= -1;
              }
            }

            if (
              x + LEMMING_SIZE >= GAME_WIDTH - 50 &&
              y + LEMMING_SIZE >= GAME_HEIGHT - 70
            ) {
              setSavedLemmings((prev) => prev + 1);
              return null;
            }

            return {
              ...lemming,
              x,
              y,
              direction,
              isFalling,
            };
          })
          .filter(Boolean) as Lemming[]
      );

      if (spawnCount === totalLemmings && lemmings.length === 0) {
        setGameOver(true);
        if (savedLemmings >= totalLemmings / 2) {
          setGameWin(true);
        }
      }
    }, 20);

    return () => clearInterval(gameLoop);
  }, [lemmings, spawnCount, savedLemmings]);

  return (
    <div className="relative w-full h-screen bg-gray-900 flex justify-center items-center">
      <div className="absolute top-4 left-4 text-white">
        <h1 className="text-2xl font-bold">Code Lemmings</h1>
        <p>Help the lemmings reach the exit!</p>
        <p>Lemmings Saved: {savedLemmings}</p>
        <p>Lemmings Remaining: {totalLemmings - savedLemmings}</p>
      </div>

      <div
        className="relative bg-green-500 overflow-hidden"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
      >
        <div className="absolute bottom-0 w-full h-5 bg-brown-700"></div>

        <div
          className="absolute"
          style={{
            bottom: "20px",
            right: "0px",
            width: "50px",
            height: "50px",
          }}
        >
          <svg
            width="50"
            height="50"
            viewBox="0 0 50 50"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="50" height="50" fill="#0000FF" />
            <text
              x="25"
              y="30"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="16"
              fontWeight="bold"
            >
              EXIT
            </text>
          </svg>
        </div>

        {lemmings.map((lemming) => (
          <div
            key={lemming.id}
            className="absolute"
            style={{
              left: lemming.x,
              top: lemming.y,
              width: LEMMING_SIZE,
              height: LEMMING_SIZE,
            }}
          >
            <svg
              width={LEMMING_SIZE}
              height={LEMMING_SIZE}
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="10" cy="10" r="10" fill="#00FF00" />
            </svg>
          </div>
        ))}
      </div>

      {gameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex justify-center items-center">
          <h2 className="text-4xl text-white">
            {gameWin ? "You Win!" : "Game Over"}
          </h2>
        </div>
      )}
    </div>
  );
};

export default GamePage;

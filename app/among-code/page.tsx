"use client";

import React, { useState, useEffect } from "react";

interface Player {
  id: number;
  name: string;
  isImpostor: boolean;
  x: number;
  y: number;
  color: string;
}

const colors = ["red", "blue", "green", "yellow"];

const Game: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerId, setCurrentPlayerId] = useState<number>(1);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [winner, setWinner] = useState<string>("");

  useEffect(() => {
    // Initialize players
    const initialPlayers: Player[] = [];
    for (let i = 1; i <= 4; i++) {
      initialPlayers.push({
        id: i,
        name: `Player ${i}`,
        isImpostor: false,
        x: Math.random() * 500,
        y: Math.random() * 500,
        color: colors[i % colors.length],
      });
    }

    // Randomly assign an impostor
    const impostorIndex = Math.floor(Math.random() * initialPlayers.length);
    initialPlayers[impostorIndex].isImpostor = true;

    setPlayers(initialPlayers);
  }, []);

  const movePlayer = (direction: string) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) => {
        if (player.id === currentPlayerId) {
          const newX = direction === "left" ? player.x - 20 : direction === "right" ? player.x + 20 : player.x;
          const newY = direction === "up" ? player.y - 20 : direction === "down" ? player.y + 20 : player.y;
          return { ...player, x: newX, y: newY };
        }
        return player;
      })
    );
  };

  const handleAttack = () => {
    const currentPlayer = players.find((p) => p.id === currentPlayerId);
    if (!currentPlayer?.isImpostor) return;

    setPlayers((prevPlayers) =>
      prevPlayers.filter((player) => {
        const distance = Math.hypot(player.x - currentPlayer.x, player.y - currentPlayer.y);
        if (player.id !== currentPlayerId && distance < 50) {
          return false;
        }
        return true;
      })
    );

    // Check if impostor wins
    const crewmatesLeft = players.filter((p) => !p.isImpostor && p.id !== currentPlayerId);
    if (crewmatesLeft.length === 0) {
      setGameOver(true);
      setWinner("Impostor Wins!");
    }
  };

  const handleReport = () => {
    const impostor = players.find((p) => p.isImpostor);
    if (impostor) {
      setPlayers((prevPlayers) => prevPlayers.filter((p) => p.id !== impostor.id));
      setGameOver(true);
      setWinner("Crewmates Win!");
    }
  };

  return (
    <div className="relative w-full h-screen bg-gray-800">
      {players.map((player) => (
        <div
          key={player.id}
          className="absolute"
          style={{ top: player.y, left: player.x }}
        >
          <svg width="40" height="40">
            <circle cx="20" cy="20" r="20" fill={player.color} />
          </svg>
          <p className="text-white text-center">{player.name}</p>
        </div>
      ))}

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-4">
        <button
          onClick={() => movePlayer("up")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Up
        </button>
        <button
          onClick={() => movePlayer("down")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Down
        </button>
        <button
          onClick={() => movePlayer("left")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Left
        </button>
        <button
          onClick={() => movePlayer("right")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Right
        </button>
        <button
          onClick={handleAttack}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Attack
        </button>
        <button
          onClick={handleReport}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Report
        </button>
      </div>

      {gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <h1 className="text-4xl text-white">{winner}</h1>
        </div>
      )}
    </div>
  );
};

export default Game;

"use client";

import React, { useState, useEffect } from "react";

interface Position {
  x: number;
  y: number;
}

const tileSize = 20;
const mazeWidth = 28;
const mazeHeight = 31;

const initialPlayerPosition: Position = { x: 13, y: 23 };

const mazeLayout: number[][] = [
  // Row 0
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  // Row 1
  [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
  // Row 2
  [1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
  // Row 3
  [1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
  // Row 4
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  // Row 5
  [1,2,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,2,1],
  // Row 6
  [1,2,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,2,1],
  // Row 7
  [1,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,1],
  // Row 8
  [1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1],
  // Row 9
  [0,0,0,0,0,1,2,1,1,1,1,1,0,0,0,0,1,1,1,1,2,1,0,0,0,0,0,0],
  // Row 10
  [1,1,1,1,1,1,2,1,1,1,1,1,0,0,0,0,1,1,1,1,2,1,1,1,1,1,1,1],
  // Row 11
  [1,1,1,1,1,1,2,1,1,1,1,1,0,0,0,0,1,1,1,1,2,1,1,1,1,1,1,1],
  // Row 12
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  // Row 13
  [1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1],
  // Row 14
  [1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1],
  // Row 15
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  // Row 16
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  // Row 17
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  // Row 18
  [1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1],
  // Row 19
  [1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1],
  // Row 20
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  // Row 21
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  // Row 22
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  // Row 23
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  // Row 24
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  // Row 25
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  // Row 26
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  // Row 27
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  // Row 28
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  // Row 29
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  // Row 30
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

const ghostInitialPositions: Position[] = [
  { x: 13, y: 14 },
  { x: 14, y: 14 },
  // Add positions for other ghosts
];

const Page = () => {
  const [playerPosition, setPlayerPosition] = useState<Position>(initialPlayerPosition);
  const [maze, setMaze] = useState<number[][]>(mazeLayout);
  const [ghostPositions, setGhostPositions] = useState<Position[]>(ghostInitialPositions);

  const handleKeyDown = (event: KeyboardEvent) => {
    let newPosition = { ...playerPosition };

    switch (event.key) {
      case "ArrowUp":
        newPosition.y -= 1;
        break;
      case "ArrowDown":
        newPosition.y += 1;
        break;
      case "ArrowLeft":
        newPosition.x -= 1;
        break;
      case "ArrowRight":
        newPosition.x += 1;
        break;
      default:
        break;
    }

    if (!isWall(newPosition.x, newPosition.y)) {
      setPlayerPosition(newPosition);
      eatPellet(newPosition.x, newPosition.y);
    }
  };

  const isWall = (x: number, y: number) => {
    if (x < 0 || x >= mazeWidth || y < 0 || y >= mazeHeight) return true;
    return maze[y][x] === 1;
  };

  const eatPellet = (x: number, y: number) => {
    if (maze[y][x] === 2) {
      const newMaze = maze.map((row) => row.slice());
      newMaze[y][x] = 0;
      setMaze(newMaze);
    }
  };

  const moveGhosts = () => {
    const newGhostPositions = ghostPositions.map((ghost) => {
      const directions = [
        { x: 0, y: -1 },
        { x: 0, y: 1 },
        { x: -1, y: 0 },
        { x: 1, y: 0 },
      ];
      const validDirections = directions.filter(
        (dir) => !isWall(ghost.x + dir.x, ghost.y + dir.y)
      );
      if (validDirections.length > 0) {
        const move = validDirections[Math.floor(Math.random() * validDirections.length)];
        return { x: ghost.x + move.x, y: ghost.y + move.y };
      }
      return ghost;
    });
    setGhostPositions(newGhostPositions);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    const ghostInterval = setInterval(moveGhosts, 500);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearInterval(ghostInterval);
    };
  }, [playerPosition, maze, ghostPositions]);

  const renderMaze = () => {
    const elements = [];
    for (let y = 0; y < mazeHeight; y++) {
      for (let x = 0; x < mazeWidth; x++) {
        const tile = maze[y][x];
        if (tile === 1) {
          elements.push(
            <rect
              key={`wall-${x}-${y}`}
              x={x * tileSize}
              y={y * tileSize}
              width={tileSize}
              height={tileSize}
              fill="#0000ff"
            />
          );
        } else if (tile === 2) {
          elements.push(
            <circle
              key={`pellet-${x}-${y}`}
              cx={x * tileSize + tileSize / 2}
              cy={y * tileSize + tileSize / 2}
              r={tileSize / 8}
              fill="#ffffff"
            />
          );
        }
      }
    }
    return <>{elements}</>;
  };

  const renderPlayer = () => (
    <g
      transform={`translate(${playerPosition.x * tileSize}, ${
        playerPosition.y * tileSize
      })`}
    >
      <circle cx={tileSize / 2} cy={tileSize / 2} r={tileSize / 2} fill="yellow" />
    </g>
  );

  const renderGhosts = () =>
    ghostPositions.map((ghost, index) => (
      <g
        key={`ghost-${index}`}
        transform={`translate(${ghost.x * tileSize}, ${ghost.y * tileSize})`}
      >
        <path
          d={`
            M ${tileSize / 2} 0
            L ${tileSize} ${tileSize}
            L 0 ${tileSize}
            Z
          `}
          fill="red"
        />
      </g>
    ));

  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <svg
        width={mazeWidth * tileSize}
        height={mazeHeight * tileSize}
        className="mx-auto relative"
      >
        {renderMaze()}
        {renderPlayer()}
        {renderGhosts()}
      </svg>
    </div>
  );
};

export default Page;

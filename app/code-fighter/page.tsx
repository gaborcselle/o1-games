'use client';

import React, { useState, useEffect } from 'react';

const CodeFighter = () => {
  const [playerPosition, setPlayerPosition] = useState({ x: 100, y: 0 });
  const [opponentPosition, setOpponentPosition] = useState({ x: 400, y: 0 });
  const [playerHealth, setPlayerHealth] = useState(100);
  const [opponentHealth, setOpponentHealth] = useState(100);
  const [gameMessage, setGameMessage] = useState('');
  const [playerAttacking, setPlayerAttacking] = useState(false);
  const [opponentAttacking, setOpponentAttacking] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Handle player controls
      if (event.key === 'ArrowRight') {
        // Move player to the right
        setPlayerPosition((prev) => ({ ...prev, x: prev.x + 20 }));
      } else if (event.key === 'ArrowLeft') {
        // Move player to the left
        setPlayerPosition((prev) => ({ ...prev, x: prev.x - 20 }));
      } else if (event.key === 'a') {
        // Player attack
        setPlayerAttacking(true);
        setTimeout(() => {
          setPlayerAttacking(false);
        }, 200);
        // Check if opponent is in range
        if (Math.abs(playerPosition.x - opponentPosition.x) < 60) {
          setOpponentHealth((prev) => Math.max(prev - 10, 0));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [playerPosition, opponentPosition]);

  useEffect(() => {
    const opponentInterval = setInterval(() => {
      // Move opponent towards player
      setOpponentPosition((prev) => {
        if (prev.x > playerPosition.x) {
          return { ...prev, x: prev.x - 10 };
        } else if (prev.x < playerPosition.x) {
          return { ...prev, x: prev.x + 10 };
        } else {
          return prev;
        }
      });

      // Opponent attack
      if (Math.abs(playerPosition.x - opponentPosition.x) < 60) {
        setOpponentAttacking(true);
        setTimeout(() => {
          setOpponentAttacking(false);
        }, 200);
        setPlayerHealth((prev) => Math.max(prev - 5, 0));
      }
    }, 500);

    return () => clearInterval(opponentInterval);
  }, [playerPosition]);

  useEffect(() => {
    if (playerHealth <= 0) {
      setGameMessage('Game Over');
    } else if (opponentHealth <= 0) {
      setGameMessage('You Win!');
    }
  }, [playerHealth, opponentHealth]);

  const Fighter1SVG = () => (
    <svg width="50" height="100">
      <rect width="50" height="100" fill="blue" />
    </svg>
  );

  const Fighter2SVG = () => (
    <svg width="50" height="100">
      <rect width="50" height="100" fill="red" />
    </svg>
  );

  const BackgroundSVG = () => (
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
      <rect width="100%" height="100%" fill="#333" />
    </svg>
  );

  return (
    <div className="relative w-full h-screen bg-gray-800 overflow-hidden">
      <BackgroundSVG />
      <div className="absolute bottom-0 left-0 w-full h-20 bg-green-700"></div>
      <div
        className={`absolute bottom-20 transition-transform duration-100 ${
          playerAttacking ? 'animate-punch' : ''
        }`}
        style={{ transform: `translateX(${playerPosition.x}px)` }}
      >
        <Fighter1SVG />
      </div>
      <div
        className={`absolute bottom-20 transition-transform duration-100 ${
          opponentAttacking ? 'animate-punch' : ''
        }`}
        style={{ transform: `translateX(${opponentPosition.x}px)` }}
      >
        <Fighter2SVG />
      </div>
      <div className="absolute top-0 left-0 m-4 text-white">
        Player Health: {playerHealth}
      </div>
      <div className="absolute top-0 right-0 m-4 text-white">
        Opponent Health: {opponentHealth}
      </div>
      {gameMessage && (
        <div className="absolute inset-0 flex items-center justify-center text-4xl text-white">
          {gameMessage}
        </div>
      )}
      <style jsx>{`
        @keyframes punch {
          0% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(10px);
          }
          100% {
            transform: translateX(0);
          }
        }
        .animate-punch {
          animation: punch 0.2s forwards;
        }
      `}</style>
    </div>
  );
};

export default CodeFighter;

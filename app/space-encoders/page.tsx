"use client";
import { useEffect, useRef, useState } from "react";

interface Player {
  x: number;
  y: number;
}

interface Bullet {
  x: number;
  y: number;
}

interface Enemy {
  x: number;
  y: number;
  direction: number;
}

export default function SpaceEncoders() {
  const [player, setPlayer] = useState<Player>({ x: 230, y: 450 });
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [keysPressed, setKeysPressed] = useState<{ [key: string]: boolean }>({});
  const gameAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize enemies
    const initialEnemies: Enemy[] = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 10; col++) {
        initialEnemies.push({
          x: 50 + col * 40,
          y: 50 + row * 40,
          direction: 1,
        });
      }
    }
    setEnemies(initialEnemies);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeysPressed((prev) => ({ ...prev, [e.key]: true }));
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      setKeysPressed((prev) => ({ ...prev, [e.key]: false }));
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      // Move player
      setPlayer((prev) => {
        let newX = prev.x;
        if (keysPressed["ArrowLeft"] && prev.x > 0) {
          newX -= 5;
        }
        if (keysPressed["ArrowRight"] && prev.x < 460) {
          newX += 5;
        }
        return { ...prev, x: newX };
      });

      // Fire bullet
      if (keysPressed[" "] || keysPressed["Spacebar"]) {
        setBullets((prev) => {
          if (prev.length === 0 || prev[prev.length - 1].y < player.y - 20) {
            return [...prev, { x: player.x + 15, y: player.y }];
          }
          return prev;
        });
      }

      // Move bullets
      setBullets((prev) =>
        prev
          .map((bullet) => ({ ...bullet, y: bullet.y - 10 }))
          .filter((bullet) => bullet.y > 0)
      );

      // Move enemies
      setEnemies((prev) =>
        prev.map((enemy) => ({ ...enemy, x: enemy.x + enemy.direction * 2 }))
      );

      // Check for collisions
      setEnemies((enemies) =>
        enemies.filter((enemy) => {
          const hit = bullets.some(
            (bullet) =>
              bullet.x >= enemy.x &&
              bullet.x <= enemy.x + 30 &&
              bullet.y >= enemy.y &&
              bullet.y <= enemy.y + 30
          );
          if (hit) {
            setBullets((bullets) =>
              bullets.filter(
                (bullet) =>
                  !(
                    bullet.x >= enemy.x &&
                    bullet.x <= enemy.x + 30 &&
                    bullet.y >= enemy.y &&
                    bullet.y <= enemy.y + 30
                  )
              )
            );
            return false;
          }
          return true;
        })
      );

      // Change enemy direction
      setEnemies((prev) => {
        const shouldChangeDirection = prev.some(
          (enemy) => enemy.x <= 0 || enemy.x >= 470
        );
        if (shouldChangeDirection) {
          return prev.map((enemy) => ({
            ...enemy,
            y: enemy.y + 10,
            direction: -enemy.direction,
          }));
        }
        return prev;
      });

      // Check game over
      enemies.forEach((enemy) => {
        if (enemy.y >= player.y - 30) {
          // Game over logic
          clearInterval(gameLoop);
          alert("Game Over");
        }
      });
    }, 30);
    return () => clearInterval(gameLoop);
  }, [keysPressed, player.y, bullets, enemies]);

  return (
    <div
      ref={gameAreaRef}
      className="relative w-[500px] h-[500px] bg-black overflow-hidden m-auto mt-10 border border-gray-700"
    >
      {/* Player */}
      <div
        className="absolute"
        style={{ left: player.x, top: player.y }}
      >
        {/* Player SVG */}
        <svg width="40" height="40">
          <polygon points="20,0 0,40 40,40" fill="#00ff00" />
        </svg>
      </div>

      {/* Bullets */}
      {bullets.map((bullet, index) => (
        <div
          key={index}
          className="absolute"
          style={{ left: bullet.x, top: bullet.y }}
        >
          {/* Bullet SVG */}
          <svg width="10" height="20">
            <rect width="2" height="10" x="4" y="0" fill="#ffffff" />
          </svg>
        </div>
      ))}

      {/* Enemies */}
      {enemies.map((enemy, index) => (
        <div
          key={index}
          className="absolute"
          style={{ left: enemy.x, top: enemy.y }}
        >
          {/* Enemy SVG */}
          <svg width="30" height="30">
            <circle cx="15" cy="15" r="15" fill="#ff0000" />
          </svg>
        </div>
      ))}
    </div>
  );
}

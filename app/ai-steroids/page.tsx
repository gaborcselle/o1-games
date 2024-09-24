"use client";

import { useEffect, useRef, useState } from "react";

type Bullet = {
  x: number;
  y: number;
  angle: number;
};

const Aisteroids = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [keys, setKeys] = useState<Record<string, boolean>>({});
  const [ship, setShip] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    angle: 0,
    speed: 0,
    velocityX: 0,
    velocityY: 0,
  });
  const [asteroids, setAsteroids] = useState<Array<any>>([]);
  const [bullets, setBullets] = useState<Array<Bullet>>([]);

  const createAsteroids = (num: number) => {
    let tempAsteroids = [];
    for (let i = 0; i < num; i++) {
      tempAsteroids.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 30 + 20,
        angle: Math.random() * 360,
        speed: Math.random() * 0.3 + 0.2, // Reduced speed
      });
    }
    setAsteroids(tempAsteroids);
  };

  const drawShip = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.translate(ship.x, ship.y);
    ctx.rotate((ship.angle * Math.PI) / 180);

    const shipSVG = `
      <svg width="40" height="40" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <polygon points="32,0 64,64 32,48 0,64" fill="#34D399" />
      </svg>`;
    const img = new Image();
    img.src = "data:image/svg+xml;base64," + window.btoa(shipSVG);
    ctx.drawImage(img, -20, -20, 40, 40);
    ctx.restore();
  };

  const drawAsteroids = (ctx: CanvasRenderingContext2D) => {
    asteroids.forEach((asteroid) => {
      ctx.save();
      ctx.translate(asteroid.x, asteroid.y);
      ctx.rotate((asteroid.angle * Math.PI) / 180);

      const asteroidSVG = `
        <svg width="40" height="40" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="${asteroid.radius}" fill="#F87171" />
        </svg>`;
      const img = new Image();
      img.src = "data:image/svg+xml;base64," + window.btoa(asteroidSVG);
      ctx.drawImage(img, -asteroid.radius, -asteroid.radius, asteroid.radius * 2, asteroid.radius * 2);
      ctx.restore();
    });
  };

  const drawBullets = (ctx: CanvasRenderingContext2D) => {
    bullets.forEach((bullet) => {
      ctx.save();
      ctx.fillStyle = "#FBBF24";
      ctx.beginPath();
      ctx.arc(bullet.x, bullet.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  };

  const updateGame = () => {
    let newShip = { ...ship };

    if (keys["ArrowUp"]) {
      newShip.velocityX += Math.cos((newShip.angle * Math.PI) / 180) * 0.1;
      newShip.velocityY += Math.sin((newShip.angle * Math.PI) / 180) * 0.1;
    }

    if (keys["ArrowLeft"]) {
      newShip.angle -= 3;
    }
    if (keys["ArrowRight"]) {
      newShip.angle += 3;
    }

    newShip.x += newShip.velocityX;
    newShip.y += newShip.velocityY;

    // Wrap around screen
    if (newShip.x > window.innerWidth) newShip.x = 0;
    if (newShip.x < 0) newShip.x = window.innerWidth;
    if (newShip.y > window.innerHeight) newShip.y = 0;
    if (newShip.y < 0) newShip.y = window.innerHeight;

    setShip(newShip);

    let newAsteroids = asteroids.map((asteroid) => {
      asteroid.x += Math.cos((asteroid.angle * Math.PI) / 180) * asteroid.speed;
      asteroid.y += Math.sin((asteroid.angle * Math.PI) / 180) * asteroid.speed;

      // Wrap around screen
      if (asteroid.x > window.innerWidth) asteroid.x = 0;
      if (asteroid.x < 0) asteroid.x = window.innerWidth;
      if (asteroid.y > window.innerHeight) asteroid.y = 0;
      if (asteroid.y < 0) asteroid.y = window.innerHeight;

      return asteroid;
    });
    setAsteroids(newAsteroids);

    let newBullets = bullets
      .map((bullet) => {
        return {
          ...bullet,
          x: bullet.x + Math.cos((bullet.angle * Math.PI) / 180) * 5,
          y: bullet.y + Math.sin((bullet.angle * Math.PI) / 180) * 5,
        };
      })
      .filter(
        (bullet) =>
          bullet.x > 0 &&
          bullet.x < window.innerWidth &&
          bullet.y > 0 &&
          bullet.y < window.innerHeight
      );

    setBullets(newBullets);
  };

  const drawGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    drawShip(ctx);
    drawAsteroids(ctx);
    drawBullets(ctx);
  };

  const gameLoop = () => {
    updateGame();
    drawGame();
    requestAnimationFrame(gameLoop);
  };

  const shootBullet = () => {
    const newBullet = {
      x: ship.x,
      y: ship.y,
      angle: ship.angle,
    };
    setBullets((prevBullets) => [...prevBullets, newBullet]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " ") {
        shootBullet();
      }
      setKeys((prevKeys) => ({ ...prevKeys, [e.key]: true }));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys((prevKeys) => ({ ...prevKeys, [e.key]: false }));
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [ship]);

  useEffect(() => {
    createAsteroids(5);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    requestAnimationFrame(gameLoop);
  }, [ship, asteroids, bullets]);

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-black">
      <canvas ref={canvasRef} className="absolute top-0 left-0" />
      <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 text-white">
        <p>Aisteroids - Use Arrow Keys to Navigate, Space to Shoot</p>
      </div>
    </div>
  );
};

export default Aisteroids;

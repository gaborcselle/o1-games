'use client';

import React, { useState, useEffect, useRef } from 'react';

type Brick = {
  x: number;
  y: number;
  width: number;
  height: number;
  status: number;
};

type Paddle = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type Ball = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
};

const CodeBreak: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [bricks, setBricks] = useState<Brick[]>([]);
  const [paddle, setPaddle] = useState<Paddle>({ x: 0, y: 0, width: 100, height: 20 });
  const [ball, setBall] = useState<Ball>({ x: 0, y: 0, vx: 0, vy: 0, radius: 10 });
  const [gameWidth] = useState(800);
  const [gameHeight] = useState(600);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameMessage, setGameMessage] = useState<string | null>(null);

  const paddleRef = useRef(paddle);
  const ballRef = useRef(ball);

  useEffect(() => {
    paddleRef.current = paddle;
  }, [paddle]);

  useEffect(() => {
    ballRef.current = ball;
  }, [ball]);

  const initializeGame = () => {
    setPaddle({
      x: (gameWidth - 100) / 2,
      y: gameHeight - 20 - 10,
      width: 100,
      height: 20,
    });

    const brickRows = 5;
    const brickColumns = 8;
    const brickWidth = 75;
    const brickHeight = 20;
    const brickPadding = 10;
    const brickOffsetTop = 30;
    const brickOffsetLeft = 30;

    const bricksArray: Brick[] = [];

    for (let r = 0; r < brickRows; r++) {
      for (let c = 0; c < brickColumns; c++) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricksArray.push({ x: brickX, y: brickY, width: brickWidth, height: brickHeight, status: 1 });
      }
    }

    setBricks(bricksArray);

    setBall({
      x: gameWidth / 2,
      y: gameHeight - 50,
      vx: 2 * (Math.random() > 0.5 ? 1 : -1),
      vy: -2,
      radius: 10,
    });

    setIsGameOver(false);
  };

  useEffect(() => {
    initializeGame();
    let animationFrameId: number;

    const render = () => {
      updateBallPosition();
      collisionDetection();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const updateBallPosition = () => {
    setBall((prevBall) => {
      let newX = prevBall.x + prevBall.vx;
      let newY = prevBall.y + prevBall.vy;
      let { vx, vy } = prevBall;

      if (newX + prevBall.radius > gameWidth || newX - prevBall.radius < 0) {
        vx = -vx;
      }

      if (newY - prevBall.radius < 0) {
        vy = -vy;
      }

      const paddle = paddleRef.current;
      if (
        newY + prevBall.radius >= paddle.y &&
        newY - prevBall.radius <= paddle.y + paddle.height &&
        newX + prevBall.radius >= paddle.x &&
        newX - prevBall.radius <= paddle.x + paddle.width
      ) {
        vy = -vy;
        newY = paddle.y - prevBall.radius - 1;
      } else if (newY + prevBall.radius > gameHeight) {
        setIsGameOver(true);
        setGameMessage('GAME OVER');
        setTimeout(() => {
          setGameMessage(null);
          initializeGame();
        }, 2000);
      }

      return { ...prevBall, x: newX, y: newY, vx, vy };
    });
  };

  const collisionDetection = () => {
    const ball = ballRef.current;

    setBricks((prevBricks) => {
      let bricksUpdated = false;
      const updatedBricks = prevBricks.map((brick) => {
        if (brick.status === 1) {
          if (
            ball.x + ball.radius > brick.x &&
            ball.x - ball.radius < brick.x + brick.width &&
            ball.y + ball.radius > brick.y &&
            ball.y - ball.radius < brick.y + brick.height
          ) {
            let { vx, vy } = ball;

            const overlapLeft = ball.x + ball.radius - brick.x;
            const overlapRight = brick.x + brick.width - (ball.x - ball.radius);
            const overlapTop = ball.y + ball.radius - brick.y;
            const overlapBottom = brick.y + brick.height - (ball.y - ball.radius);

            const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

            if (minOverlap === overlapLeft || minOverlap === overlapRight) {
              vx = -vx;
            } else {
              vy = -vy;
            }

            setBall((ball) => ({ ...ball, vx, vy }));
            bricksUpdated = true;
            return { ...brick, status: 0 };
          }
        }
        return brick;
      });

      if (bricksUpdated) {
        if (updatedBricks.every((b) => b.status === 0)) {
          setIsGameOver(true);
          setGameMessage('YOU WIN!');
          setTimeout(() => {
            setGameMessage(null);
            initializeGame();
          }, 2000);
        }
      }

      return updatedBricks;
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = svgRef.current!.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    if (relativeX > 0 && relativeX < gameWidth) {
      setPaddle((paddle) => ({ ...paddle, x: relativeX - paddle.width / 2 }));
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-gray-900"
      onMouseMove={handleMouseMove}
      style={{ cursor: 'none' }}
    >
      <svg
        ref={svgRef}
        width={gameWidth}
        height={gameHeight}
        className="border border-white"
      >
        <defs>
          <linearGradient id="brickGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#ff7e5f', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#feb47b', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="paddleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#43cea2', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#185a9d', stopOpacity: 1 }} />
          </linearGradient>
          <radialGradient id="ballGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{ stopColor: '#f7971e', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#ffd200', stopOpacity: 1 }} />
          </radialGradient>
          <filter id="dropShadow" height="130%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dx="2" dy="2" result="offsetblur" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {bricks.map((brick, index) =>
          brick.status === 1 ? (
            <rect
              key={index}
              x={brick.x}
              y={brick.y}
              width={brick.width}
              height={brick.height}
              fill="url(#brickGradient)"
              filter="url(#dropShadow)"
            />
          ) : null
        )}

        <rect
          x={paddle.x}
          y={paddle.y}
          width={paddle.width}
          height={paddle.height}
          fill="url(#paddleGradient)"
          filter="url(#dropShadow)"
        />

        <circle
          cx={ball.x}
          cy={ball.y}
          r={ball.radius}
          fill="url(#ballGradient)"
          filter="url(#dropShadow)"
        />

        {gameMessage && (
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            fill="white"
            fontSize="48"
            fontWeight="bold"
            dy=".3em"
          >
            {gameMessage}
          </text>
        )}
      </svg>
    </div>
  );
};

export default CodeBreak;

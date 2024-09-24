"use client";
import { useState, useEffect } from 'react';

const width = 8;
const candyColors = ['red', 'orange', 'yellow', 'green', 'teal', 'blue', 'purple'];

const getCandySvg = (candyColor: string) => {
  switch (candyColor) {
    case 'red':
      return (
        <svg viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="20" fill="#FF5733" />
        </svg>
      );
    case 'orange':
      return (
        <svg viewBox="0 0 50 50">
          <rect x="5" y="5" width="40" height="40" fill="#FFBD33" />
        </svg>
      );
    case 'yellow':
      return (
        <svg viewBox="0 0 50 50">
          <polygon points="25,5 45,45 5,45" fill="#FFF033" />
        </svg>
      );
    case 'green':
      return (
        <svg viewBox="0 0 50 50">
          <ellipse cx="25" cy="25" rx="20" ry="15" fill="#75FF33" />
        </svg>
      );
    case 'teal':
      return (
        <svg viewBox="0 0 50 50">
          <path d="M25 5 L45 25 L25 45 L5 25 Z" fill="#33FFBD" />
        </svg>
      );
    case 'blue':
      return (
        <svg viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="20" fill="#335BFF" />
          <circle cx="25" cy="25" r="10" fill="white" />
        </svg>
      );
    case 'purple':
      return (
        <svg viewBox="0 0 50 50">
          <rect x="5" y="5" width="40" height="40" fill="#8E33FF" rx="10" ry="10" />
        </svg>
      );
    default:
      return null;
  }
};

const targetScore = 100;

const CodeCrush = () => {
  const [currentColorArrangement, setCurrentColorArrangement] = useState<string[]>([]);
  const [squareBeingDraggedId, setSquareBeingDraggedId] = useState<number | null>(null);
  const [squareBeingReplacedId, setSquareBeingReplacedId] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [message, setMessage] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(60);

  const checkForColumnOfFour = () => {
    for (let i = 0; i <= 39; i++) {
      const columnOfFour = [i, i + width, i + width * 2, i + width * 3];
      const decidedColor = currentColorArrangement[i];
      if (
        columnOfFour.every(
          (square) => currentColorArrangement[square] === decidedColor && decidedColor !== '',
        )
      ) {
        setScore((score) => score + 4);
        columnOfFour.forEach((square) => (currentColorArrangement[square] = ''));
        return true;
      }
    }
  };

  const checkForRowOfFour = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfFour = [i, i + 1, i + 2, i + 3];
      const decidedColor = currentColorArrangement[i];
      const notValid = [];
      for (let j = 5; j < 64; j += width) {
        notValid.push(j, j + 1, j + 2, j + 3);
      }
      if (notValid.includes(i)) continue;
      if (
        rowOfFour.every(
          (square) => currentColorArrangement[square] === decidedColor && decidedColor !== '',
        )
      ) {
        setScore((score) => score + 4);
        rowOfFour.forEach((square) => (currentColorArrangement[square] = ''));
        return true;
      }
    }
  };

  const checkForColumnOfThree = () => {
    for (let i = 0; i <= 47; i++) {
      const columnOfThree = [i, i + width, i + width * 2];
      const decidedColor = currentColorArrangement[i];
      if (
        columnOfThree.every(
          (square) => currentColorArrangement[square] === decidedColor && decidedColor !== '',
        )
      ) {
        setScore((score) => score + 3);
        columnOfThree.forEach((square) => (currentColorArrangement[square] = ''));
        return true;
      }
    }
  };

  const checkForRowOfThree = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfThree = [i, i + 1, i + 2];
      const decidedColor = currentColorArrangement[i];
      const notValid = [];
      for (let j = 6; j < 64; j += width) {
        notValid.push(j, j + 1);
      }
      if (notValid.includes(i)) continue;
      if (
        rowOfThree.every(
          (square) => currentColorArrangement[square] === decidedColor && decidedColor !== '',
        )
      ) {
        setScore((score) => score + 3);
        rowOfThree.forEach((square) => (currentColorArrangement[square] = ''));
        return true;
      }
    }
  };

  const moveIntoSquareBelow = () => {
    for (let i = 55; i >= 0; i--) {
      if (currentColorArrangement[i + width] === '') {
        currentColorArrangement[i + width] = currentColorArrangement[i];
        currentColorArrangement[i] = '';
      }
    }
    for (let i = 0; i < width; i++) {
      if (currentColorArrangement[i] === '') {
        const randomColor =
          candyColors[Math.floor(Math.random() * candyColors.length)];
        currentColorArrangement[i] = randomColor;
      }
    }
  };

  const dragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setSquareBeingDraggedId(parseInt(e.currentTarget.getAttribute('data-id')!));
  };

  const dragDrop = (e: React.DragEvent<HTMLDivElement>) => {
    setSquareBeingReplacedId(parseInt(e.currentTarget.getAttribute('data-id')!));
  };

  const dragEnd = () => {
    if (
      squareBeingDraggedId !== null &&
      squareBeingReplacedId !== null &&
      timeLeft > 0 &&
      score < targetScore
    ) {
      const validMoves = [
        squareBeingDraggedId - 1,
        squareBeingDraggedId - width,
        squareBeingDraggedId + 1,
        squareBeingDraggedId + width,
      ];

      const validMove = validMoves.includes(squareBeingReplacedId);

      if (validMove) {
        const temp = currentColorArrangement[squareBeingDraggedId];
        currentColorArrangement[squareBeingDraggedId] =
          currentColorArrangement[squareBeingReplacedId];
        currentColorArrangement[squareBeingReplacedId] = temp;
        setCurrentColorArrangement([...currentColorArrangement]);

        const isAColumnOfFour = checkForColumnOfFour();
        const isARowOfFour = checkForRowOfFour();
        const isAColumnOfThree = checkForColumnOfThree();
        const isARowOfThree = checkForRowOfThree();

        if (isAColumnOfFour || isARowOfFour || isAColumnOfThree || isARowOfThree) {
          setSquareBeingDraggedId(null);
          setSquareBeingReplacedId(null);
        } else {
          currentColorArrangement[squareBeingDraggedId] =
            currentColorArrangement[squareBeingReplacedId];
          currentColorArrangement[squareBeingReplacedId] = temp;
          setCurrentColorArrangement([...currentColorArrangement]);
        }
      } else {
        setSquareBeingDraggedId(null);
        setSquareBeingReplacedId(null);
      }
    }
  };

  const createBoard = () => {
    const randomColorArrangement = [];
    for (let i = 0; i < width * width; i++) {
      const randomColor =
        candyColors[Math.floor(Math.random() * candyColors.length)];
      randomColorArrangement.push(randomColor);
    }
    setCurrentColorArrangement(randomColorArrangement);
  };

  useEffect(() => {
    createBoard();
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && score < targetScore) {
      const timer = setInterval(() => {
        checkForColumnOfFour();
        checkForRowOfFour();
        checkForColumnOfThree();
        checkForRowOfThree();
        moveIntoSquareBelow();
        setCurrentColorArrangement([...currentColorArrangement]);
      }, 100);
      return () => clearInterval(timer);
    } else if (score >= targetScore) {
      setMessage('You Win!');
    }
  }, [currentColorArrangement, timeLeft, score]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((timeLeft) => timeLeft - 1);
      }, 1000);
      return () => clearInterval(timerId);
    } else {
      setMessage('Game Over');
    }
  }, [timeLeft]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800">
      <h1 className="text-4xl font-bold text-white mb-4">Code Crush</h1>
      <div className="text-white mb-2">Score: {score}</div>
      <div className="text-white mb-4">Time Left: {timeLeft}</div>
      <div className="w-64 h-64 grid grid-cols-8 grid-rows-8">
        {currentColorArrangement.map((candyColor, index) => (
          <div
            key={index}
            data-id={index}
            className="w-8 h-8 border border-gray-700 flex items-center justify-center transition-all duration-300"
            draggable={true}
            onDragStart={dragStart}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
            onDragLeave={(e) => e.preventDefault()}
            onDrop={dragDrop}
            onDragEnd={dragEnd}
          >
            {candyColor && getCandySvg(candyColor)}
          </div>
        ))}
      </div>
      {message && <div className="text-white mt-4 text-2xl">{message}</div>}
    </div>
  );
};

export default CodeCrush;

import { useState, useEffect } from "react";

const COLS = 10; // Número de columnas
const ROWS = 20; // Número de filas

const TETROMINOS = [
  {
    shape: [
      [1, 1, 1],
      [0, 1, 0],
    ],
    color: "bg-yellow-400",
  },
  {
    shape: [
      [1, 1, 1, 1],
    ],
    color: "bg-blue-600",
  },
  {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: "bg-green-500",
  },
  {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    color: "bg-purple-700",
  },
  {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    color: "bg-red-500",
  },
  {
    shape: [
      [1, 1, 1],
      [1, 0, 0],
    ],
    color: "bg-teal-500",
  },
  {
    shape: [
      [1, 1, 1],
      [0, 0, 1],
    ],
    color: "bg-indigo-500",
  },
];

const Tetris = () => {
  const [board, setBoard] = useState(Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
  const [currentTetromino, setCurrentTetromino] = useState(null);
  const [position, setPosition] = useState({ x: COLS / 2 - 1, y: 0 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const startGame = () => {
      const tetromino = generateRandomTetromino();
      setCurrentTetromino(tetromino);
      setPosition({ x: COLS / 2 - 1, y: 0 });
    };

    startGame();
  }, []);

  const generateRandomTetromino = () => {
    const randomIndex = Math.floor(Math.random() * TETROMINOS.length);
    return TETROMINOS[randomIndex];
  };

  const moveTetromino = (dx, dy) => {
    setPosition((prevPosition) => {
      const newX = prevPosition.x + dx;
      const newY = prevPosition.y + dy;

      if (!collision(newX, newY, currentTetromino.shape)) {
        return { x: newX, y: newY };
      } else {
        return prevPosition;
      }
    });
  };

  const rotateTetromino = () => {
    const rotatedShape = currentTetromino.shape[0].map((_, index) =>
      currentTetromino.shape.map((row) => row[index])
    );

    if (!collision(position.x, position.y, rotatedShape)) {
      setCurrentTetromino({ ...currentTetromino, shape: rotatedShape });
    }
  };

  const collision = (x, y, shape) => {
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col] !== 0) {
          const newX = x + col;
          const newY = y + row;

          if (newX < 0 || newX >= COLS || newY >= ROWS || board[newY][newX]) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const dropTetromino = () => {
    setPosition((prevPosition) => {
      const newY = prevPosition.y + 1;

      if (collision(prevPosition.x, newY, currentTetromino.shape)) {
        placeTetromino();
        return { x: COLS / 2 - 1, y: 0 };
      }
      return { x: prevPosition.x, y: newY };
    });
  };

  const placeTetromino = () => {
    const newBoard = [...board];
    const { x, y } = position;
    currentTetromino.shape.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell !== 0) {
          newBoard[y + rowIndex][x + colIndex] = currentTetromino.color;
        }
      });
    });

    setBoard(newBoard);
    clearFullRows(newBoard);
  };

  const clearFullRows = (board) => {
    const newBoard = board.filter((row) => row.some((cell) => cell === null));
    const clearedRows = ROWS - newBoard.length;
    setScore((prevScore) => prevScore + clearedRows * 100);
    while (newBoard.length < ROWS) {
      newBoard.unshift(Array(COLS).fill(null));
    }
    setBoard(newBoard);
  };

  const handleKeyPress = (e) => {
    if (gameOver) return;
    if (e.key === "ArrowLeft") {
      moveTetromino(-1, 0);
    } else if (e.key === "ArrowRight") {
      moveTetromino(1, 0);
    } else if (e.key === "ArrowDown") {
      dropTetromino();
    } else if (e.key === "ArrowUp") {
      rotateTetromino();
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!gameOver) {
        dropTetromino();
      }
    }, 500);

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [board, position, gameOver, currentTetromino]);

  return (
    <div className="flex flex-col items-center justify-center bg-gray-900 min-h-screen p-4">
      <div className="flex justify-between w-full max-w-xl mb-4">
        <h2 className="text-3xl text-white">Tetris</h2>
        <div className="text-white">Puntaje: {score}</div>
      </div>

      <div
        className="grid grid-cols-10 gap-1 bg-black p-1 rounded-lg"
        style={{ gridTemplateRows: `repeat(${ROWS}, 1fr)` }}
      >
        {board.flat().map((cell, index) => {
          const row = Math.floor(index / COLS);
          const col = index % COLS;
          return (
            <div
              key={index}
              className={`w-8 h-8 ${cell || "bg-gray-800"} border border-gray-600`}
            ></div>
          );
        })}
      </div>

      {gameOver && (
        <div className="mt-4 text-white text-xl">
          Game Over! <button onClick={() => window.location.reload()}>Restart</button>
        </div>
      )}
    </div>
  );
};

export default Tetris;

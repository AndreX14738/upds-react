import { useState, useEffect } from "react";

const SNAKE_SIZE = 10;  // Tamaño de cada segmento de la serpiente
const BOARD_SIZE = 450;  // Tamaño del tablero en píxeles (450px x 450px)

const SnakeGame = () => {
  const [snake, setSnake] = useState([
    { x: 50, y: 50 },
    { x: 40, y: 50 },
    { x: 30, y: 50 },
  ]);
  const [direction, setDirection] = useState("RIGHT");
  const [food, setFood] = useState({ x: 200, y: 200 });  // Comida en una posición fija
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "ArrowUp" && direction !== "DOWN") {
        setDirection("UP");
      } else if (e.key === "ArrowDown" && direction !== "UP") {
        setDirection("DOWN");
      } else if (e.key === "ArrowLeft" && direction !== "RIGHT") {
        setDirection("LEFT");
      } else if (e.key === "ArrowRight" && direction !== "LEFT") {
        setDirection("RIGHT");
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    const gameInterval = setInterval(() => {
      if (!gameOver) moveSnake();
    }, 100);

    return () => {
      clearInterval(gameInterval);
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [direction, snake, gameOver]);

  const moveSnake = () => {
    const newSnake = [...snake];
    const head = { ...newSnake[0] };

    switch (direction) {
      case "UP":
        head.y -= SNAKE_SIZE;
        break;
      case "DOWN":
        head.y += SNAKE_SIZE;
        break;
      case "LEFT":
        head.x -= SNAKE_SIZE;
        break;
      case "RIGHT":
        head.x += SNAKE_SIZE;
        break;
      default:
        break;
    }

    newSnake.unshift(head);

    // Si la serpiente come la comida
    if (head.x === food.x && head.y === food.y) {
      setScore((prev) => prev + 1);
      // La comida ya no se mueve, permaneciendo en la misma posición
    } else {
      newSnake.pop(); // Eliminar el último segmento si no ha comido
    }

    // Verificar si la serpiente choca consigo misma o con los bordes
    if (isGameOver(newSnake)) {
      setGameOver(true);
    } else {
      setSnake(newSnake);
    }
  };

  const isGameOver = (newSnake) => {
    const head = newSnake[0];

    // Verificar si la serpiente choca con los bordes
    if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
      return true;
    }

    // Verificar si la serpiente choca consigo misma
    for (let i = 1; i < newSnake.length; i++) {
      if (newSnake[i].x === head.x && newSnake[i].y === head.y) {
        return true;
      }
    }

    return false;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <h2 className="text-3xl text-white mb-4">Snake Game</h2>
      <div className="relative">
        <div
          className="border-4 border-white"
          style={{
            width: BOARD_SIZE + "px",
            height: BOARD_SIZE + "px",
            position: "relative",
            backgroundColor: "#000",
          }}
        >
          {snake.map((segment, index) => (
            <div
              key={index}
              className="absolute"
              style={{
                left: segment.x + "px",
                top: segment.y + "px",
                width: SNAKE_SIZE + "px",
                height: SNAKE_SIZE + "px",
                backgroundColor: "#00FF00",
              }}
            ></div>
          ))}

          <div
            className="absolute"
            style={{
              left: food.x + "px",
              top: food.y + "px",
              width: SNAKE_SIZE + "px",
              height: SNAKE_SIZE + "px",
              backgroundColor: "#FF0000",
            }}
          ></div>
        </div>
      </div>

      {gameOver && (
        <div className="mt-4 text-white text-xl">
          Game Over! Score: {score}{" "}
          <button
            onClick={() => window.location.reload()}
            className="mt-2 bg-green-500 px-4 py-2 rounded text-white"
          >
            Restart
          </button>
        </div>
      )}

      {!gameOver && <div className="mt-4 text-white text-lg">Score: {score}</div>}
    </div>
  );
};

export default SnakeGame;

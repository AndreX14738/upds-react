import { useState, useEffect } from "react";

const MAZE_SIZE = 10; // Tamaño del laberinto (10x10)
const START_POSITION = { x: 0, y: 0 }; // Posición inicial
const END_POSITION = { x: MAZE_SIZE - 1, y: MAZE_SIZE - 1 }; // Posición de salida

const Maze = () => {
  const [playerPosition, setPlayerPosition] = useState(START_POSITION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [timer, setTimer] = useState(30); // Tiempo límite de 30 segundos
  const [bestTime, setBestTime] = useState(localStorage.getItem("bestTime") || null); // Mejor tiempo almacenado
  const [maze, setMaze] = useState(generateMaze(MAZE_SIZE));

  // Generación del laberinto aleatorio
  function generateMaze(size) {
    const maze = Array(size).fill(null).map(() => Array(size).fill(1)); // 1 representa una pared
    // Añadir caminos aleatorios (0 representa un camino libre)
    for (let row = 1; row < size - 1; row++) {
      for (let col = 1; col < size - 1; col++) {
        maze[row][col] = Math.random() < 0.7 ? 0 : 1;
      }
    }
    maze[START_POSITION.y][START_POSITION.x] = 0;
    maze[END_POSITION.y][END_POSITION.x] = 0;
    return maze;
  }

  // Iniciar el temporizador
  useEffect(() => {
    if (isGameOver) return;

    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setIsGameOver(true);
    }
  }, [timer, isGameOver]);

  // Mover al jugador según la tecla presionada
  const handleKeyPress = (e) => {
    if (isGameOver) return;

    const { x, y } = playerPosition;

    switch (e.key) {
      case "ArrowUp":
        if (y > 0 && maze[y - 1][x] === 0) setPlayerPosition({ x, y: y - 1 });
        break;
      case "ArrowDown":
        if (y < MAZE_SIZE - 1 && maze[y + 1][x] === 0) setPlayerPosition({ x, y: y + 1 });
        break;
      case "ArrowLeft":
        if (x > 0 && maze[y][x - 1] === 0) setPlayerPosition({ x: x - 1, y });
        break;
      case "ArrowRight":
        if (x < MAZE_SIZE - 1 && maze[y][x + 1] === 0) setPlayerPosition({ x: x + 1, y });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [playerPosition]);

  // Verificar si el jugador ha alcanzado la meta
  useEffect(() => {
    if (
      playerPosition.x === END_POSITION.x &&
      playerPosition.y === END_POSITION.y
    ) {
      setIsGameOver(true);
      if (timer > 0) {
        if (!bestTime || timer > bestTime) {
          setBestTime(timer);
          localStorage.setItem("bestTime", timer); // Guardar mejor tiempo
        }
      }
    }
  }, [playerPosition]);

  // Reiniciar el juego
  const restartGame = () => {
    setPlayerPosition(START_POSITION);
    setTimer(30);
    setIsGameOver(false);
    setMaze(generateMaze(MAZE_SIZE));
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-900 min-h-screen p-4">
      <h1 className="text-3xl text-green-400 font-bold mb-4">Maze Game</h1>
      <div className="text-white text-lg mb-4">
        {isGameOver
          ? playerPosition.x === END_POSITION.x &&
            playerPosition.y === END_POSITION.y
            ? `¡Ganaste! Tiempo: ${30 - timer}s`
            : `¡Juego terminado!`
          : `Tiempo restante: ${timer}s`}
      </div>

      <div className="mb-4 text-lg text-white">
        {bestTime
          ? `Mejor Tiempo: ${bestTime}s`
          : "Aún no tienes un mejor tiempo."}
      </div>

      <div
        className="grid grid-cols-10 gap-1 bg-gray-800 p-1 rounded-lg"
        style={{
          gridTemplateRows: `repeat(${MAZE_SIZE}, 1fr)`,
        }}
      >
        {Array.from({ length: MAZE_SIZE }).map((_, row) =>
          Array.from({ length: MAZE_SIZE }).map((_, col) => {
            const isPlayer = playerPosition.x === col && playerPosition.y === row;
            const isEnd = END_POSITION.x === col && END_POSITION.y === row;
            return (
              <div
                key={`${row}-${col}`}
                className={`w-8 h-8 border border-gray-600 rounded-sm ${
                  maze[row][col] === 1
                    ? "bg-gray-700"
                    : isPlayer
                    ? "bg-green-500"
                    : isEnd
                    ? "bg-blue-500"
                    : "bg-transparent"
                }`}
              ></div>
            );
          })
        )}
      </div>

      <button
        className="mt-4 px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-lg hover:bg-red-500"
        onClick={restartGame}
      >
        Restart Game
      </button>
    </div>
  );
};

export default Maze;

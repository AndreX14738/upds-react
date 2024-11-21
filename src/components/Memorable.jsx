import { useState, useEffect } from "react";

const cardArray = [
  { name: "fries", img: "/assets/fries.png" },
  { name: "cheeseburger", img: "/assets/cheeseburger.png" },
  { name: "ice-cream", img: "/assets/ice-cream.png" },
  { name: "pizza", img: "/assets/pizza.png" },
  { name: "milkshake", img: "/assets/milkshake.png" },
  { name: "hotdog", img: "/assets/hotdog.png" },
  { name: "fries", img: "/assets/fries.png" },
  { name: "cheeseburger", img: "/assets/cheeseburger.png" },
  { name: "ice-cream", img: "/assets/ice-cream.png" },
  { name: "pizza", img: "/assets/pizza.png" },
  { name: "milkshake", img: "/assets/milkshake.png" },
  { name: "hotdog", img: "/assets/hotdog.png" },
];

function Memorable() {
  const [cards, setCards] = useState([]);
  const [cardsChosen, setCardsChosen] = useState([]);
  const [cardsChosenId, setCardsChosenId] = useState([]);
  const [cardsWon, setCardsWon] = useState([]);
  const [result, setResult] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timer, setTimer] = useState(60);
  const [bestTimes, setBestTimes] = useState([]); // Mejores tiempos

  useEffect(() => {
    setCards(cardArray.sort(() => 0.5 - Math.random())); // Barajar las cartas
  }, []);

  useEffect(() => {
    if (timer > 0 && !gameOver) {
      const timerId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(timerId);
    } else if (timer === 0 || cardsWon.length === cards.length / 2) {
      setGameOver(true); // Finalizar el juego si el tiempo termina o se gana
    }
  }, [timer, gameOver, cardsWon]);

  const flipCard = (id) => {
    if (cardsChosen.length === 2 || gameOver) return;

    const chosenCard = cards[id];
    if (cardsChosenId.includes(id)) return;

    setCardsChosen([...cardsChosen, chosenCard.name]);
    setCardsChosenId([...cardsChosenId, id]);
  };

  useEffect(() => {
    if (cardsChosen.length === 2) {
      setTimeout(() => checkForMatch(), 500);
    }
  }, [cardsChosen]);

  const checkForMatch = () => {
    const [firstId, secondId] = cardsChosenId;
    const isMatch = cardsChosen[0] === cardsChosen[1];

    if (isMatch && firstId !== secondId) {
      setCardsWon([...cardsWon, firstId, secondId]);
    } else {
      setWrongAnswers(wrongAnswers + 1);
    }

    setCardsChosen([]);
    setCardsChosenId([]);
    setResult(cardsWon.length / 2 + 1);

    // Si se ganan todas las parejas, actualizar mejores tiempos
    if (cardsWon.length + 2 === cards.length) {
      setBestTimes((prev) => [...prev, 60 - timer].sort((a, b) => a - b).slice(0, 3)); // Top 3 mejores tiempos
      setGameOver(true);
    }
  };

  const renderCard = (card, index) => {
    const isFlipped = cardsChosenId.includes(index) || cardsWon.includes(index);
    return (
      <img
        key={index}
        src={isFlipped ? card.img : "/assets/blank.jpg"}
        alt="card"
        className="w-24 h-24 object-cover rounded-lg shadow-lg cursor-pointer transform transition-transform hover:scale-105"
        onClick={() => flipCard(index)}
      />
    );
  };

  const startNewGame = () => {
    setCards(cardArray.sort(() => 0.5 - Math.random()));
    setCardsChosen([]);
    setCardsChosenId([]);
    setCardsWon([]);
    setResult(0);
    setWrongAnswers(0);
    setTimer(60);
    setGameOver(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-900 via-purple-800 to-black p-4">
      <h3 className="text-3xl font-bold text-yellow-400 mb-4">
        Cartas adivinadas: <span className="font-extrabold">{result}</span>
      </h3>
      <h3 className="text-xl text-red-500 mb-4">
        Intentos fallidos: <span className="font-extrabold">{wrongAnswers}</span>
      </h3>
      <h3 className="text-xl text-green-300 mb-6">
        Tiempo restante: <span className="font-extrabold">{timer}</span> segundos
      </h3>
      <div className="grid grid-cols-4 gap-4 mb-4">{cards.map(renderCard)}</div>
      {cardsWon.length === cards.length / 2 && !gameOver && (
        <h2 className="text-3xl font-extrabold text-green-500 mt-4 animate-pulse">
          ¡Has encontrado todas las parejas!
        </h2>
      )}
      <button
        className="mt-6 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-500 transition transform hover:scale-105"
        onClick={startNewGame}
      >
        Empezar Nuevo Juego
      </button>

      {gameOver && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-yellow-500 p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-2xl font-semibold text-black">
              {cardsWon.length === cards.length / 2
                ? "Felicidades, has ganado!"
                : "Se acabó el tiempo!"
              }
            </h2>
            <button
              className="mt-4 px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-400 transition"
              onClick={startNewGame}
            >
              Volver a jugar
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 bg-slate-400 p-4 rounded-lg shadow-lg max-w-lg w-full">
        <h3 className="text-xl font-semibold text-black mb-4">
          Mejores Tiempos (en segundos):
        </h3>
        <ul>
          {bestTimes.length > 0 ? (
            bestTimes.map((time, index) => (
              <li key={index} className="text-lg text-blue-600">
                {index + 1}. {time} segundos
              </li>
            ))
          ) : (
            <li className="text-lg text-gray-600">No hay tiempos registrados.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Memorable;

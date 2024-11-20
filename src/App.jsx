import { useState, useEffect } from 'react';
import './App.css';

const cardArray = [
  { name: 'fries', img: '/assets/fries.png' },
  { name: 'cheeseburger', img: '/assets/cheeseburger.png' },
  { name: 'ice-cream', img: '/assets/ice-cream.png' },
  { name: 'pizza', img: '/assets/pizza.png' },
  { name: 'milkshake', img: '/assets/milkshake.png' },
  { name: 'hotdog', img: '/assets/hotdog.png' },
  { name: 'fries', img: '/assets/fries.png' },
  { name: 'cheeseburger', img: '/assets/cheeseburger.png' },
  { name: 'ice-cream', img: '/assets/ice-cream.png' },
  { name: 'pizza', img: '/assets/pizza.png' },
  { name: 'milkshake', img: '/assets/milkshake.png' },
  { name: 'hotdog', img: '/assets/hotdog.png' },
];

function App() {
  const [cards, setCards] = useState([]);
  const [cardsChosen, setCardsChosen] = useState([]);
  const [cardsChosenId, setCardsChosenId] = useState([]);
  const [cardsWon, setCardsWon] = useState([]);
  const [result, setResult] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    setCards(cardArray.sort(() => 0.5 - Math.random())); // Barajar las cartas
  }, []);

  useEffect(() => {
    if (timer > 0 && !gameOver) {
      const timerId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [timer]);

  const flipCard = (id) => {
    if (cardsChosen.length === 2 || gameOver) return; // Limitar a dos cartas a la vez

    const chosenCard = cards[id];
    if (cardsChosenId.includes(id)) return; // Evitar seleccionar la misma carta dos veces

    setCardsChosen([...cardsChosen, chosenCard.name]);
    setCardsChosenId([...cardsChosenId, id]);
  };

  useEffect(() => {
    if (cardsChosen.length === 2) {
      setTimeout(() => checkForMatch(), 500); // Comprobar si las cartas coinciden
    }
  }, [cardsChosen]);

  const checkForMatch = () => {
    const [firstId, secondId] = cardsChosenId;
    const isMatch = cardsChosen[0] === cardsChosen[1];

    if (isMatch && firstId !== secondId) {
      setCardsWon([...cardsWon, firstId, secondId]);
      setModalMessage('¡Encontraste una pareja!');
      setShowModal(true);
    } else {
      setWrongAnswers(wrongAnswers + 1);
      setModalMessage('¡Intenta nuevamente!');
      setShowModal(true);
    }

    setCardsChosen([]);
    setCardsChosenId([]);
    setResult(cardsWon.length / 2 + 1); // Actualizar el puntaje
  };

  const renderCard = (card, index) => {
    const isFlipped = cardsChosenId.includes(index) || cardsWon.includes(index);
    return (
      <img
        key={index}
        src={isFlipped ? card.img : '/assets/blank.jpg'}
        alt="card"
        className="w-24 h-24 object-cover rounded-lg shadow-lg cursor-pointer"
        onClick={() => flipCard(index)}
      />
    );
  };

  const startNewGame = () => {
    setCards(cardArray.sort(() => 0.5 - Math.random())); // Rebarajar cartas
    setCardsChosen([]);
    setCardsChosenId([]);
    setCardsWon([]);
    setResult(0);
    setWrongAnswers(0);
    setTimer(60); // Comenzar el temporizador de 60 segundos
    setGameOver(false);
    setShowModal(false);
  };

  const closeModal = () => {
    setShowModal(false);
    if (cardsWon.length === cards.length / 2) {
      setGameOver(true);
      setModalMessage('¡Felicidades, has ganado el juego!');
      setShowModal(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h3 className="text-xl font-semibold mb-4">
        Cartas adivinadas: <span className="font-bold">{result}</span>
      </h3>
      <h3 className="text-lg mb-4">
        Intentos fallidos: <span className="font-bold">{wrongAnswers}</span>
      </h3>
      <h3 className="text-lg mb-4">
        Tiempo restante: <span className="font-bold">{timer}</span> segundos
      </h3>
      <div className="grid grid-cols-4 gap-4 mb-4">
        {cards.map(renderCard)}
      </div>
      {cardsWon.length === cards.length / 2 && !gameOver && (
        <h2 className="text-2xl font-bold text-green-500 mt-4">¡Has encontrado todas las parejas!</h2>
      )}
      <button
        className="mt-6 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-400 transition"
        onClick={startNewGame}
      >
        Empezar Nuevo Juego
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">{modalMessage}</h2>
            <button
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-400 transition"
              onClick={closeModal}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

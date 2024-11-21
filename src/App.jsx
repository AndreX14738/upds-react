import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { useState } from "react";
import "./App.css"
import SnakeGame from "./components/SnakeGame";
import Tetris from "./components/Tretis";
import Memorable from "./components/Memorable";
import MazeGame from "./components/MazeGame";

function App() {
  return (
    <Router>
      <div className="">
        <nav className="">
          <Link to="/memorable" className=" text-blue-500 mr-4">Memorable</Link>
          <Link to="/tetris" className=" text-blue-500 mr-4">Tetris</Link>
          <Link to="/snake" className=" text-blue-500">Snake</Link>
          <Link to="MazeGame" className=" text-blue-500">MazeGame</Link>
        </nav>
        <Routes>
          <Route path="/memorable" element={<Memorable />} />
          <Route path="/tetris" element={<Tetris />} />
          <Route path="/snake" element={<SnakeGame />} />
          <Route path="/laberinto" element={<MazeGame />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

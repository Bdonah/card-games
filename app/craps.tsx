"use client";

import { useState } from "react";

export default function Craps() {
  const [dice, setDice] = useState<number[]>([1, 1]);
  const [point, setPoint] = useState<number | null>(null);
  const [message, setMessage] = useState<string>("🎯 Roll the dice to start!");
  const [gameOver, setGameOver] = useState(false);

  function rollDice() {
    if (gameOver) return;

    const roll1 = Math.floor(Math.random() * 6) + 1;
    const roll2 = Math.floor(Math.random() * 6) + 1;
    const total = roll1 + roll2;

    setDice([roll1, roll2]);

    if (point === null) {
      // First roll
      if (total === 7 || total === 11) {
        setMessage("🎉 You rolled " + total + "! You WIN!");
        setGameOver(true);
      } else if (total === 2 || total === 3 || total === 12) {
        setMessage("💀 You rolled " + total + "! Craps — You LOSE!");
        setGameOver(true);
      } else {
        setPoint(total);
        setMessage(`🎯 Point is set to ${total}. Roll again!`);
      }
    } else {
      // Trying to hit the point
      if (total === point) {
        setMessage(`🎉 You hit your point (${point})! You WIN!`);
        setGameOver(true);
      } else if (total === 7) {
        setMessage("💀 You rolled 7! You LOSE!");
        setGameOver(true);
      } else {
        setMessage(`🔵 Rolled ${total}. Keep rolling for your point (${point})!`);
      }
    }
  }

  function resetGame() {
    setDice([1, 1]);
    setPoint(null);
    setMessage("🎯 Roll the dice to start!");
    setGameOver(false);
  }

  return (
    <div className="min-h-screen bg-green-900 text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-6">🎲 Craps 🎲</h1>

      {/* Dice Display */}
      <div className="flex gap-6 mb-6">
        {dice.map((die, idx) => (
          <div
            key={idx}
            className="w-20 h-20 flex items-center justify-center bg-white text-black text-3xl font-bold rounded-lg shadow-md"
          >
            {die}
          </div>
        ))}
      </div>

      {/* Message Display */}
      <div
        className={`text-2xl font-bold mb-8 ${
          message.includes("WIN") ? "text-green-400"
          : message.includes("LOSE") ? "text-red-400"
          : "text-blue-300"
        }`}
      >
        {message}
      </div>

      {/* Buttons */}
      <div className="flex gap-6">
        {!gameOver ? (
          <button
            onClick={rollDice}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-xl text-xl shadow-md"
          >
            🎲 Roll Dice
          </button>
        ) : (
          <button
            onClick={resetGame}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-xl text-xl shadow-md"
          >
            🔁 Play Again
          </button>
        )}
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import Image from "next/image";

const redNumbers = new Set([
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
]);
const blackNumbers = new Set([
  2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35,
]);

export default function Roulette() {
  const [bet, setBet] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [spinning, setSpinning] = useState(false);

  function spinWheel() {
    setSpinning(true);
    setMessage("");
    setResult(null);

    setTimeout(() => {
      const landed = Math.floor(Math.random() * 37);
      setResult(landed);

      if (bet === "red" && redNumbers.has(landed)) {
        setMessage("You WIN! 🎉");
      } else if (bet === "black" && blackNumbers.has(landed)) {
        setMessage("You WIN! 🎉");
      } else if (bet === "even" && landed !== 0 && landed % 2 === 0) {
        setMessage("You WIN! 🎉");
      } else if (bet === "odd" && landed % 2 === 1) {
        setMessage("You WIN! 🎉");
      } else if (bet === landed.toString()) {
        setMessage("Huge WIN! 🤑");
      } else {
        setMessage("You lose. 😢");
      }

      setSpinning(false);
    }, 3000); // 3 second spin
  }

  return (
    <div className="min-h-screen bg-green-900 text-white flex flex-col items-center justify-center p-8 overflow-hidden relative">
      {/* 🔥 Animations Inline */}
      <style>{`
        @keyframes spin-fast {
          from { transform: rotate(0deg); }
          to { transform: rotate(720deg); }
        }
        @keyframes spin-fast-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-720deg); }
        }
        .animate-spin-fast {
          animation: spin-fast 3s linear infinite;
        }
        .animate-spin-fast-reverse {
          animation: spin-fast-reverse 3s linear infinite;
        }
      `}</style>

      <h1 className="text-5xl font-extrabold mb-8 text-yellow-400 drop-shadow-lg text-center">
        🎡 Vegas Roulette 🎡
      </h1>

      {/* WHEEL AND BALL */}
      <div className="relative w-80 h-80 mb-10">
  {/* Wheel */}
  <Image
    src="/wheel.png"
    alt="Roulette Wheel"
    width={320}
    height={320}
    className={`absolute top-0 left-0 w-80 h-80 ${
      spinning ? "animate-spin-fast" : ""
    }`}
  />

  {/* Ball container that spins opposite */}
  <div
    className={`absolute top-0 left-0 w-80 h-80 ${
      spinning ? "animate-spin-fast-reverse" : ""
    } flex items-center justify-center`}
  >
    {/* Ball itself, positioned outward */}
    <div className="w-4 h-4 bg-white border-2 border-black rounded-full translate-y-[-130px]" />
  </div>
</div>
      {/* BET OPTIONS */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center">
  <button
    onClick={() => setBet("red")}
    className={`py-2 px-4 rounded font-bold border-2 ${
      bet === "red" ? "bg-red-600 border-yellow-400 scale-110" : "bg-red-600 hover:bg-red-700"
    }`}
  >
    🔴 Bet Red
  </button>

  <button
    onClick={() => setBet("black")}
    className={`py-2 px-4 rounded font-bold border-2 ${
      bet === "black" ? "bg-black border-yellow-400 scale-110" : "bg-black hover:bg-gray-700"
    }`}
  >
    ⚫ Bet Black
  </button>

  <button
    onClick={() => setBet("even")}
    className={`py-2 px-4 rounded font-bold border-2 ${
      bet === "even" ? "bg-blue-600 border-yellow-400 scale-110" : "bg-blue-600 hover:bg-blue-700"
    }`}
  >
    ➡️ Bet Even
  </button>

  <button
    onClick={() => setBet("odd")}
    className={`py-2 px-4 rounded font-bold border-2 ${
      bet === "odd" ? "bg-blue-600 border-yellow-400 scale-110" : "bg-blue-600 hover:bg-blue-700"
    }`}
  >
    ⬅️ Bet Odd
  </button>
</div>

      {/* NUMBER BET INPUT */}
      <div className="flex flex-col items-center mb-8">
        <input
          type="number"
          min="0"
          max="36"
          value={bet}
          onChange={(e) => setBet(e.target.value)}
          placeholder="Or bet a number (0-36)"
          className="text-black p-4 w-64 rounded-lg text-lg text-center"
        />
      </div>

      {/* SPIN BUTTON */}
      <button
        onClick={spinWheel}
        disabled={spinning}
        className={`${
          spinning
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-yellow-400 hover:bg-yellow-500"
        } text-black font-bold py-4 px-10 rounded-full text-2xl shadow-lg mb-6`}
      >
        {spinning ? "Spinning..." : "SPIN 🎯"}
      </button>

      {/* RESULT AFTER SPIN */}
      {result !== null && (
        <div className="text-center mt-6">
          <div className="text-4xl font-bold mb-2">
            {result}{" "}
            {redNumbers.has(result)
              ? "🔴"
              : blackNumbers.has(result)
              ? "⚫"
              : "🟢"}
          </div>
          <div className="text-3xl font-semibold">{message}</div>
        </div>
      )}
    </div>
  );
}
"use client";

import { useState} from "react";

const symbols = ["🍒", "🍋", "🔔", "💎", "7️⃣", "🍀"];

export default function Slots() {
  const [reels, setReels] = useState(["❔", "❔", "❔"]);
  const [spinning, setSpinning] = useState(false);
  const [message, setMessage] = useState("");

  function spin() {
    setSpinning(true);
    setMessage(""); // clear old message

    const spinInterval = setInterval(() => {
      setReels([
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
      ]);
    }, 100); // spin fast

    setTimeout(() => {
      clearInterval(spinInterval); // stop spinning
      const finalReels = [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
      ];
      setReels(finalReels);
      setSpinning(false);

      // Check for jackpot
      if (finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2]) {
        setMessage("🎉 JACKPOT! 🎉");
      } else {
        setMessage("😢 Try Again!");
      }
    }, 2000); // spin for 2 seconds
  }

  return (
    <div className="min-h-screen bg-green-900 text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-bold mb-10 text-yellow-400">🎰 Slot Machine 🎰</h1>

      {/* Slot reels */}
      <div className="flex gap-8 text-8xl mb-10">
        {reels.map((symbol, idx) => (
          <div
            key={idx}
            className="bg-white text-black rounded-lg w-24 h-24 flex items-center justify-center shadow-lg"
          >
            {symbol}
          </div>
        ))}
      </div>

      {/* Spin button */}
      <button
        onClick={spin}
        className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-10 rounded-lg text-2xl shadow-md disabled:opacity-50"
        disabled={spinning}
      >
        {spinning ? "Spinning..." : "🎲 Spin"}
      </button>

      {/* Message */}
      {message && (
        <div className="text-3xl mt-8 font-bold drop-shadow-md">
          {message}
        </div>
      )}
    </div>
  );
}
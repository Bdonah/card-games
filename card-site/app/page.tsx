"use client";

import { useState } from "react";
import PokerGame from "./heads-up"; 

const AnotherGame = () => <div>Another game coming soon!</div>; 

export default function Home() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  if (selectedGame === "poker") {
    return <PokerGame />;
  }

  if (selectedGame === "anotherGame") {
    return <AnotherGame />;
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-green-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-10">Brendant&apos;s Card Room</h1>
      <div className="flex flex-col space-y-6">
        <button
          onClick={() => setSelectedGame("poker")}
          className="px-6 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-md text-xl"
        >
          ♠️ Play Poker
        </button>
        <button
          onClick={() => setSelectedGame("anotherGame")}
          className="px-6 py-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 shadow-md text-xl"
        >
          🎯 Play Another Game (Coming Soon)
        </button>
      </div>
    </main>
  );
}
"use client";

import { useState } from "react";
import Image from "next/image";
import PokerGame from "./heads-up";
// import RouletteGame from "./roulette"; // Uncomment when you have the Roulette page ready

const AnotherGame = () => <div>Another game coming soon!</div>;

export default function Home() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  function handleReturnHome() {
    setSelectedGame(null); // Reset to show main menu
  }

  if (selectedGame === "poker") {
    return (
      <div className="min-h-screen bg-green-900 text-white p-8 flex flex-col">
        <button
          onClick={handleReturnHome}
          className="self-start mb-4 px-4 py-2 bg-gray-700 hover:bg-gray-800 rounded"
        >
          ⬅️ Return Home
        </button>
        <PokerGame />
      </div>
    );
  }

  // if (selectedGame === "roulette") {
  //   return (
  //     <div className="min-h-screen bg-green-900 text-white p-8 flex flex-col">
  //       <button
  //         onClick={handleReturnHome}
  //         className="self-start mb-4 px-4 py-2 bg-gray-700 hover:bg-gray-800 rounded"
  //       >
  //         ⬅️ Return Home
  //       </button>
  //       <RouletteGame />
  //     </div>
  //   );
  // }

  if (selectedGame === "anotherGame") {
    return (
      <div className="min-h-screen bg-green-900 text-white p-8 flex flex-col">
        <button
          onClick={handleReturnHome}
          className="self-start mb-4 px-4 py-2 bg-gray-700 hover:bg-gray-800 rounded"
        >
          ⬅️ Return Home
        </button>
        <AnotherGame />
      </div>
    );
  }

  return (
    <main
      className="flex flex-col items-center justify-center min-h-screen bg-green-900 text-white p-8"
      style={{
        backgroundImage: 'url("/background.gif")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <h1 className="text-4xl font-bold mb-10">Brendant&apos;s Card Room</h1>
  
      {/* Layout Row */}
      <div className="flex items-center justify-center gap-12">
        {/* Left Image */}
        <Image
          src="/win-big2.png"
          alt="Win Big"
          width={450}
          height={370}
          className="rounded-lg shadow-lg hover:scale-105 transition-transform"
        />
  
        {/* Center Buttons */}
        <div className="flex flex-col space-y-6 items-center">
          <button
            onClick={() => setSelectedGame("poker")}
            className="px-6 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-md text-xl"
          >
            ♠️ Play Poker
          </button>
          <button
            onClick={() => setSelectedGame("roulette")}
            className="px-6 py-4 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-md text-xl"
          >
            🎡 Play Roulette
          </button>
          <button
            onClick={() => setSelectedGame("anotherGame")}
            className="px-6 py-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 shadow-md text-xl"
          >
            🎯 Play Another Game (Coming Soon)
          </button>
        </div>
  
        {/* Right Image */}
        <Image
          src="/phil.png"
          alt="Phil"
          width={400}
          height={320}
          className="rounded-lg shadow-lg hover:scale-105 transition-transform"
        />
      </div>
    </main>
  );
}
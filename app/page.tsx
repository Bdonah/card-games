"use client";

import { useState } from "react";
import Image from "next/image";
import PokerGame from "./heads-up";
import RouletteGame from "./roulette";
import BlackjackGame from "./blackjack";
import Slots from "./slots";
import VideoPoker from "./videopoker";
import HelpPopup from "@/components/HelpPopup"; 
import Craps from "./craps"; 
import Layout from "@/components/Layout"; // Import it!

const AnotherGame = () => <div>Another game coming soon!</div>;

export default function Home() {
  
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);  
  
  

  function togglePopup() {
    setShowHelp(prev => !prev);  
  }

  function handleReturnHome() {
    setSelectedGame(null);
  }

  if (selectedGame === "poker") {
    return (
      <div className="min-h-screen bg-green-900 text-white p-8 flex flex-col">
        <button onClick={handleReturnHome} className="self-start mb-4 px-4 py-2 bg-gray-700 hover:bg-gray-800 rounded">
          ⬅️ Return Home
        </button>
        <PokerGame />
      </div>
    );
  }

  if (selectedGame === "roulette") {
    return (
      <div className="min-h-screen bg-green-900 text-white p-8 flex flex-col">
        <button onClick={handleReturnHome} className="self-start mb-4 px-4 py-2 bg-gray-700 hover:bg-gray-800 rounded">
          ⬅️ Return Home
        </button>
        <RouletteGame />
      </div>
    );
  }

  if (selectedGame === "blackjack") {
    return (
      <div className="min-h-screen bg-green-900 text-white p-8 flex flex-col">
        <button onClick={handleReturnHome} className="self-start mb-4 px-4 py-2 bg-gray-700 hover:bg-gray-800 rounded">
          ⬅️ Return Home
        </button>
        <BlackjackGame />
      </div>
    );
  }

  if (selectedGame === "slots") {
    return (
      <div className="min-h-screen bg-green-900 text-white p-8 flex flex-col">
        <button onClick={handleReturnHome} className="self-start mb-4 px-4 py-2 bg-gray-700 hover:bg-gray-800 rounded">
          ⬅️ Return Home
        </button>
        <Slots />
      </div>
    );
  }

  if (selectedGame === "videoPoker") {
    return (
      <div className="min-h-screen bg-green-900 text-white p-8 flex flex-col">
        <button onClick={handleReturnHome} className="self-start mb-4 px-4 py-2 bg-gray-700 hover:bg-gray-800 rounded">
          ⬅️ Return Home
        </button>
        <VideoPoker />
      </div>
    );
  }
  if (selectedGame === "craps") {
    return (
      <div className="min-h-screen bg-green-900 text-white p-8 flex flex-col">
        <button
          onClick={handleReturnHome}
          className="self-start mb-4 px-4 py-2 bg-gray-700 hover:bg-gray-800 rounded"
        >
          ⬅️ Return Home
        </button>
        <Craps />
      </div>
    );
  }

  if (selectedGame === "anotherGame") {
    return (
      <div className="min-h-screen bg-green-900 text-white p-8 flex flex-col">
        <button onClick={handleReturnHome} className="self-start mb-4 px-4 py-2 bg-gray-700 hover:bg-gray-800 rounded">
          ⬅️ Return Home
        </button>
        <AnotherGame />
      </div>
    );
  }

  return (
    
    <>
    <Layout>
      {/* Help Popup */}
      <HelpPopup isOpen={showHelp} onClose={togglePopup} />

      <main
        className="flex flex-col items-center justify-center min-h-screen bg-green-900 text-white p-8"
        style={{
          backgroundImage: 'url("/background.gif")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <h1
          className="text-5xl font-extrabold mb-12 text-white drop-shadow-lg tracking-wide animate-pulse text-center"
          style={{
            textShadow: `
              2px 2px 0 #000,
              -2px 2px 0 #000,
              2px -2px 0 #000,
              -2px -2px 0 #000,
              0 0 8px #ffffff,
              0 0 16px #00ffcc
            `,
            letterSpacing: "0.2em",
          }}
        >
          🎰 BRENDAN&apos;S CARD ROOM 🎰
        </h1>

        {/* Help Button (Top Right Corner) */}
        <button
          onClick={togglePopup}
          className="fixed top-4 right-4 bg-yellow-400 text-black rounded-full p-2 w-10 h-10 flex items-center justify-center shadow-lg hover:bg-yellow-500 z-50"
        >
          ?
        </button>

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
              ♠️ Play Poker (Head&apos;s up)
            </button>
            <button
              onClick={() => setSelectedGame("roulette")}
              className="px-6 py-4 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-md text-xl"
            >
              🎡 Play Roulette
            </button>
            <button
              onClick={() => setSelectedGame("blackjack")}
              className="px-6 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow-md text-xl"
            >
              🃏 Play Blackjack
            </button>
            <button
              onClick={() => setSelectedGame("slots")}
              className="px-6 py-4 bg-pink-500 text-white rounded-lg hover:bg-pink-600 shadow-md text-xl"
            >
              🎰 Play Slots
            </button>
            <button
              onClick={() => setSelectedGame("videoPoker")}
              className="px-6 py-4 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 shadow-md text-xl"
            >
              🃏 Play Video Poker
            </button>
            <button
              onClick={() => setSelectedGame("craps")}
              className="px-6 py-4 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 shadow-md text-xl"
            >
              🎲 Play Craps
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
      </Layout>
    </>
  );
}
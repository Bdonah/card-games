"use client";

import { useState } from "react";

type Card = {
  suit: string;
  value: string;
};

const suits = ["♠️", "♥️", "♣️", "♦️"];
const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

function getDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of suits) {
    for (const value of values) {
      deck.push({ suit, value });
    }
  }
  return deck.sort(() => Math.random() - 0.5);
}

export default function VideoPoker() {
  const [deck, setDeck] = useState<Card[]>([]);
  const [hand, setHand] = useState<Card[]>([]);
  const [held, setHeld] = useState<boolean[]>([false, false, false, false, false]);
  const [message, setMessage] = useState("");
  const [drawn, setDrawn] = useState(false);

  function deal() {
    const newDeck = getDeck();
    const newHand = newDeck.slice(0, 5);
    setDeck(newDeck.slice(5));
    setHand(newHand);
    setHeld([false, false, false, false, false]);
    setMessage("");
    setDrawn(false);
  }

  function toggleHold(index: number) {
    if (!drawn) {
      const newHeld = [...held];
      newHeld[index] = !newHeld[index];
      setHeld(newHeld);
    }
  }

  function draw() {
    const newHand = [...hand];
    const newDeck = [...deck];

    for (let i = 0; i < hand.length; i++) {
      if (!held[i]) {
        newHand[i] = newDeck.pop()!;
      }
    }

    setHand(newHand);
    setDeck(newDeck);
    setDrawn(true);
    evaluateHand(newHand);
  }

  function evaluateHand(finalHand: Card[]) {
    const valuesMap: Record<string, number> = {
      "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8,
      "9": 9, "10": 10, "J": 11, "Q": 12, "K": 13, "A": 14,
    };
    const counts: Record<number, number> = {};
    const suitsInHand: Record<string, number> = {};
    const numbers = finalHand.map(card => valuesMap[card.value]);
    
    for (const num of numbers) {
      counts[num] = (counts[num] || 0) + 1;
    }
    for (const card of finalHand) {
      suitsInHand[card.suit] = (suitsInHand[card.suit] || 0) + 1;
    }
    
    const uniqueNumbers = [...new Set(numbers)].sort((a, b) => a - b);
    const isStraight = uniqueNumbers.length === 5 && (uniqueNumbers[4] - uniqueNumbers[0] === 4 || (uniqueNumbers.includes(14) && uniqueNumbers[3] - uniqueNumbers[0] === 3));
    const isFlush = Object.values(suitsInHand).some(count => count === 5);
    
    if (isStraight && isFlush) {
      setMessage("🔥 Straight Flush!");
    } else if (Object.values(counts).includes(4)) {
      setMessage("💥 Four of a Kind!");
    } else if (Object.values(counts).includes(3) && Object.values(counts).includes(2)) {
      setMessage("🏠 Full House!");
    } else if (isFlush) {
      setMessage("💧 Flush!");
    } else if (isStraight) {
      setMessage("➡️ Straight!");
    } else if (Object.values(counts).includes(3)) {
      setMessage("🔺 Three of a Kind!");
    } else if (Object.values(counts).filter(c => c === 2).length === 2) {
      setMessage("✌️ Two Pair!");
    } else if (Object.values(counts).includes(2)) {
      setMessage("💖 One Pair!");
    } else {
      setMessage("😢 No Winning Hand.");
    }
  }

  return (
    <div className="min-h-screen bg-green-900 text-white flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-8">🎰 Video Poker 🎰</h1>
      <p className="text-xl font-semibold text-yellow-300 mb-4">
  🎯 Click cards to HOLD 🎯
</p>
      <div className="flex gap-4 mb-8">
        {hand.map((card, index) => (
          <div
            key={index}
            onClick={() => toggleHold(index)}
            className={`w-20 h-28 bg-white text-black flex flex-col justify-center items-center rounded-lg cursor-pointer shadow-lg ${held[index] ? "border-4 border-yellow-400" : ""}`}
          >
            <span className="text-lg font-bold">{card.value}</span>
            <span className="text-2xl">{card.suit}</span>
            {held[index] && <span className="text-xs mt-1">Held</span>}
          </div>
        ))}
      </div>

      {!hand.length ? (
        <button
          onClick={deal}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded text-xl shadow-md"
        >
          🎲 Deal
        </button>
      ) : (
        !drawn ? (
          <button
            onClick={draw}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-6 rounded text-xl shadow-md"
          >
            🎯 Draw
          </button>
        ) : (
          <button
            onClick={deal}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded text-xl shadow-md"
          >
            🔁 Play Again
          </button>
        )
      )}

      {message && (
        <div className="mt-8 text-2xl font-bold">{message}</div>
      )}
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";


type Card = {
  suit: string;
  value: string;
};

const suits = ["♠️", "♥️", "♣️", "♦️"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const STARTING_MONEY = 100;


function getDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of suits) {
    for (const value of values) {
      deck.push({ suit, value });
    }
  }
  return deck.sort(() => Math.random() - 0.5);
}

function calculateTotal(hand: Card[]): number {
  let total = 0;
  let aces = 0;

  for (const card of hand) {
    if (card.value === "A") {
      total += 11;
      aces += 1;
    } else if (["K", "Q", "J"].includes(card.value)) {
      total += 10;
    } else {
      total += parseInt(card.value);
    }
  }

  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }

  return total;
}

export default function Blackjack() {
  const [money, setMoney] = useState(STARTING_MONEY);
  const [showResetPrompt, setShowResetPrompt] = useState(false);
  
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [bet, setBet] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [playing, setPlaying] = useState(false);

  function startNewGame() {
    if (isNaN(bet) || bet <= 0) {
        setMessage("❌ Please enter a valid bet amount!");
        return;
      }
    if (bet > (money ?? 0)) {
        setMessage("❌ Bet must be less than or equal to your available money!");
        return; 
      }
    const newDeck = getDeck();
    setDeck(newDeck);

    const playerStart = [newDeck.pop()!, newDeck.pop()!];
    const dealerStart = [newDeck.pop()!, newDeck.pop()!];

    setPlayerHand(playerStart);
    setDealerHand(dealerStart);
    setGameOver(false);
    setMessage("");
    setPlaying(true);

    
  }

  function hit() {
    if (!playing) return;
    const newDeck = [...deck];
    const card = newDeck.pop()!;
    setPlayerHand([...playerHand, card]);
    setDeck(newDeck);

    const total = calculateTotal([...playerHand, card]);
    if (total > 21) {
      endGame(false);
    }
  }

  function stand() {
    if (!playing) return;
    const dealerCards = [...dealerHand];
    let dealerTotal = calculateTotal(dealerCards);

    const newDeck = [...deck];

    while (dealerTotal < 17) {
      dealerCards.push(newDeck.pop()!);
      dealerTotal = calculateTotal(dealerCards);
    }

    setDealerHand(dealerCards);
    setDeck(newDeck);

    const playerTotal = calculateTotal(playerHand);

    if (dealerTotal > 21 || playerTotal > dealerTotal) {
      endGame(true);
    } else if (dealerTotal === playerTotal) {
      endGame(null);
    } else {
      endGame(false);
    }
  }

  function endGame(win: boolean | null) {
    if (win === true) {
      setMoney(prev => {
        const newMoney = prev! + bet;
        if (newMoney <= 0) setShowResetPrompt(true); 
        return newMoney;
      });
      setMessage("🎉 You Win!");
    } else if (win === false) {
      setMoney(prev => {
        const newMoney = prev! - bet;
        if (newMoney <= 0) setShowResetPrompt(true); 
        return newMoney;
      });
      setMessage("😢 You Lose.");
    } else {
      setMessage("🤝 It's a Tie (Push).");
    }
    setGameOver(true);
    setPlaying(false);
  }
  useEffect(() => {
    if (playing && playerHand.length === 2) { // Only after first two cards
      const playerTotal = calculateTotal(playerHand);
      if (playerTotal === 21) {
        endGame(true); // 🎉 Instant Blackjack!
      }
    }
  }, [playerHand, playing]);

  return (
    <div className="min-h-screen bg-green-900 text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-extrabold text-yellow-400 mb-10 drop-shadow-md">
        🃏 Blackjack Table 🃏
      </h1>

      {/* 💵 Always show current money */}
      <h2 className="text-3xl mb-6 font-bold">💰 Money: ${money}</h2>

      {/* Betting Area */}
      {!playing && (
        <div className="flex flex-col items-center gap-6 mb-10">
          <h2 className="text-2xl font-bold text-yellow-300">Enter how much you want to bet:</h2>
          <input
            type="number"
            placeholder="Enter your bet"
            className="p-3 rounded text-black bg-white text-xl w-64 text-center shadow-md"
            value={bet === 0 ? "" : bet}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                setBet(value === "" ? 0 : Number(value));
              }
            }}
          />
          <button
            onClick={startNewGame}
            className="bg-blue-500 hover:bg-blue-600 text-white font-extrabold py-3 px-8 rounded-xl text-2xl shadow-md"
          >
            🎲 Deal
          </button>
        </div>
      )}

          {/* Cards */}
          {(playing || gameOver) && (
  <>
    <div className="flex flex-col md:flex-row items-center justify-center gap-20 mb-10">
  
  {/* Player Area */}
  <div className="flex flex-col items-center">
    {/* Player Image */}
    <Image
  src="/player.png"
  alt="Player"
  width={128}
  height={128}
  className="w-32 h-32 mb-4 rounded-lg shadow-md"
/>

    {/* Player Hand */}
    <h3 className="text-2xl font-bold mb-4 underline">Your Hand</h3>
    <div className="flex gap-3">
      {playerHand.map((card, index) => (
        <div key={index} className="bg-white text-black w-16 h-24 flex flex-col items-center justify-center rounded-lg shadow-md text-xl font-bold">
          {card.value} {card.suit}
        </div>
      ))}
    </div>
    <p className="mt-2 text-xl">Total: {calculateTotal(playerHand)}</p>
  </div>

  {/* Dealer Area */}
  <div className="flex flex-col items-center">
    {/* Dealer Image */}
    <Image
  src="/dealer.png"
  alt="Dealer"
  width={128}
  height={128}
  className="w-32 h-32 mb-4 rounded-lg shadow-md"
/>

    {/* Dealer Hand */}
    <h3 className="text-2xl font-bold mb-4 underline">Dealer&apos;s Hand</h3>
    <div className="flex gap-3">
      {dealerHand.map((card, index) => (
        <div key={index} className="w-16 h-24 bg-white text-black p-2 flex flex-col justify-center items-center rounded-lg shadow-md">
          {gameOver || index === 0 ? (
            <>
              <span className="text-lg font-bold">{card.value}</span>
              <span className="text-2xl">{card.suit}</span>
            </>
          ) : (
            <span className="text-2xl font-bold">🎴</span> // Hidden card
          )}
        </div>
      ))}
    </div>
    {/* Show Dealer Total only after game ends */}
    <p className="mt-2 text-xl font-semibold">
    Total: {gameOver ? calculateTotal(dealerHand) : calculateTotal([dealerHand[0]])}
    </p>
  </div>

</div>

    {/* Hit / Stand Buttons */}
    {!gameOver && (
      <div className="flex gap-8">
        <button
          onClick={hit}
          className="bg-green-500 hover:bg-green-600 text-white font-extrabold py-3 px-8 rounded-xl text-2xl shadow-md"
        >
          ➕ Hit
        </button>
        <button
          onClick={stand}
          className="bg-red-500 hover:bg-red-600 text-white font-extrabold py-3 px-8 rounded-xl text-2xl shadow-md"
        >
          ✋ Stand
        </button>
      </div>
    )}
  </>
)}

          {/* Win/Loss Message */}
          {message && (
            <div className="text-3xl mt-10 font-bold text-yellow-300 drop-shadow-md">
              {message}
            </div>
          )}
          {showResetPrompt && (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
    <div className="bg-white text-black p-8 rounded-lg flex flex-col gap-6 items-center">
      <h2 className="text-2xl font-bold">You&apos;re out of money! 💸</h2>
      <p className="text-lg">Would you like to restart?</p>
      <button
        onClick={() => {
          setMoney(STARTING_MONEY);
          setShowResetPrompt(false);
          setBet(0);
          setMessage("");
        }}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-xl text-xl"
      >
        🔄 Restart
      </button>
    </div>
  </div>
)}
    </div>
  );
} 
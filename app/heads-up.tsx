"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";


type Card = {
  rank: string;
  suit: string;
};

type HandResult = {
  name: string;
  rank: number;
  tiebreaker: number[];
};

const suits = ["♠️", "♥️", "♣️", "♦️"];
const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
const defaultBotNames = [
  "AceBot", "LuckyBot", "SharkBot", "QueenBot", "BluffBot",
  "DealerBot", "TiltBot", "RaiseBot", "StackBot", "CallBot"
];

const rankValues: Record<string, number> = {
  "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8,
  "9": 9, "10": 10, "J": 11, "Q": 12, "K": 13, "A": 14,
};

function getDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ rank, suit });
    }
  }
  return deck;
}

function shuffle(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getCombinations<T>(array: T[], size: number): T[][] {
  if (size > array.length) return [];
  if (size === 1) return array.map(item => [item]);
  const combinations: T[][] = [];
  array.forEach((current, index) => {
    const smaller = getCombinations(array.slice(index + 1), size - 1);
    smaller.forEach(combo => combinations.push([current, ...combo]));
  });
  return combinations;
}

function findStraight(vals: number[]): number | null {
  const sorted = [...new Set(vals)].sort((a, b) => b - a);
  if (sorted.includes(14)) sorted.push(1);
  for (let i = 0; i <= sorted.length - 5; i++) {
    const slice = sorted.slice(i, i + 5);
    if (slice[0] - slice[4] === 4) return slice[0];
  }
  return null;
}

function evaluateHand(cards: Card[]): HandResult {
  const values = cards.map(c => rankValues[c.rank]);
  const suits = cards.map(c => c.suit);
  const valueCounts: Record<number, number> = {};
  const suitCounts: Record<string, number> = {};

  values.forEach(v => valueCounts[v] = (valueCounts[v] || 0) + 1);
  suits.forEach(s => suitCounts[s] = (suitCounts[s] || 0) + 1);

  const uniqueValues = [...new Set(values)].sort((a, b) => b - a);

  const flushSuit = Object.keys(suitCounts).find(s => suitCounts[s] >= 5);
  if (flushSuit) {
    const flushCards = cards.filter(c => c.suit === flushSuit);
    const flushValues = flushCards.map(c => rankValues[c.rank]).sort((a, b) => b - a);
    const straightFlushHigh = findStraight(flushValues);
    if (straightFlushHigh) {
      return { name: straightFlushHigh === 14 ? "Royal Flush" : "Straight Flush", rank: 9, tiebreaker: [straightFlushHigh] };
    }
    return { name: "Flush", rank: 6, tiebreaker: flushValues.slice(0, 5) };
  }

  const four = Object.entries(valueCounts).find(([, count]) => count === 4);
  if (four) {
    const quad = Number(four[0]);
    const kicker = Math.max(...values.filter(v => v !== quad));
    return { name: "Four of a Kind", rank: 8, tiebreaker: [quad, kicker] };
  }

  const threes = Object.entries(valueCounts).filter(([, count]) => count === 3).map(([v]) => Number(v)).sort((a, b) => b - a);
  const pairs = Object.entries(valueCounts).filter(([, count]) => count === 2).map(([v]) => Number(v)).sort((a, b) => b - a);

  if (threes.length && (pairs.length || threes.length > 1)) {
    const bestPair = pairs.length ? pairs[0] : threes[1];
    return { name: "Full House", rank: 7, tiebreaker: [threes[0], bestPair] };
  }

  const straightHigh = findStraight(uniqueValues);
  if (straightHigh) return { name: "Straight", rank: 5, tiebreaker: [straightHigh] };

  if (threes.length) {
    const kickers = uniqueValues.filter(v => v !== threes[0]).slice(0, 2);
    return { name: "Three of a Kind", rank: 4, tiebreaker: [threes[0], ...kickers] };
  }

  if (pairs.length >= 2) {
    const kicker = uniqueValues.find(v => !pairs.includes(v))!;
    return { name: "Two Pair", rank: 3, tiebreaker: [pairs[0], pairs[1], kicker] };
  }

  if (pairs.length === 1) {
    const kickers = uniqueValues.filter(v => v !== pairs[0]).slice(0, 3);
    return { name: "One Pair", rank: 2, tiebreaker: [pairs[0], ...kickers] };
  }

  return { name: "High Card", rank: 1, tiebreaker: uniqueValues.slice(0, 5) };
}

function getBestHand(cards: Card[]): HandResult {
  const combos = getCombinations(cards, 5);
  return combos.reduce((best, combo) => compareHands(evaluateHand(combo), best) < 0 ? evaluateHand(combo) : best, evaluateHand(combos[0]));
}

function compareHands(a: HandResult, b: HandResult): number {
  if (a.rank !== b.rank) return b.rank - a.rank;
  for (let i = 0; i < Math.max(a.tiebreaker.length, b.tiebreaker.length); i++) {
    const aVal = a.tiebreaker[i] ?? 0;
    const bVal = b.tiebreaker[i] ?? 0;
    if (aVal !== bVal) return bVal - aVal;
  }
  return 0;
}

export default function PokerGame() {
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [computerHands, setComputerHands] = useState<{ name: string; hand: Card[]; winner: boolean; result?: HandResult }[]>([]);
  const [communityCards, setCommunityCards] = useState<Card[]>([]);
  const [gameMessage, setGameMessage] = useState("");
  const [step, setStep] = useState(0);
  const [numPlayers, setNumPlayers] = useState(2);
  const [playerWinner, setPlayerWinner] = useState(false);
  const [playerResult, setPlayerResult] = useState<HandResult | null>(null);
  const [customBotNames, setCustomBotNames] = useState("");
  const [gameInProgress, setGameInProgress] = useState(false);

  const startGame = useCallback(() => {
    // Clear everything first
    setStep(0);
    setGameMessage("");     // 👈 clear message first immediately
    setPlayerWinner(false); // 👈 clear winner first immediately
    setPlayerResult(null);  // 👈 clear player result
    setCommunityCards([]);  // 👈 clear old community cards
    setGameInProgress(false);
  
    // Now create fresh deck
    const newDeck = shuffle(getDeck());
  
    // Deal player new hand
    const player = [newDeck.pop()!, newDeck.pop()!];
  
    // Split user input into bot names
    const userNames = customBotNames
      .split(",")
      .map(name => name.trim())
      .filter(name => name.length > 0);
  
    // Combine user bot names and default names
    const fullBotNames = [...userNames, ...defaultBotNames].slice(0, numPlayers);
  
    // Deal computers their new hands (and clear winner flags)
    const computers = fullBotNames.map(name => ({
      name,
      hand: [newDeck.pop()!, newDeck.pop()!],
      winner: false,       // 👈 important to reset winner to false
      result: undefined,   // 👈 important to clear old results
    }));
  
    setDeck(newDeck);
    setPlayerHand(player);
    setComputerHands(computers);
    setStep(1);
  }, [numPlayers, customBotNames]);
  const dealNext = () => {
    const newDeck = [...deck];
  
    if (step === 1) {
      // Deal Flop
      setCommunityCards([newDeck.pop()!, newDeck.pop()!, newDeck.pop()!]);
      setStep(2);
    } else if (step === 2) {
      // Deal Turn
      setCommunityCards(prev => [...prev, newDeck.pop()!]);
      setStep(3);
    } else if (step === 3) {
      // Deal River
      setCommunityCards(prev => {
        const newCommunity = [...prev, newDeck.pop()!];
        return newCommunity;
      });
      setStep(4);
    }
  
    setDeck(newDeck);
  };

  const determineWinner = useCallback((bots: { name: string; hand: Card[] }[]) => {
  const playerBest = getBestHand([...playerHand, ...communityCards]);
  setPlayerResult(playerBest);

  const computerResults = bots.map(bot => ({
    ...bot,
    result: getBestHand([...bot.hand, ...communityCards]),
    winner: false,
  }));

  const allHands = [
    { name: "You", result: playerBest, isPlayer: true },
    ...computerResults.map(c => ({ name: c.name, result: c.result!, isPlayer: false })),
  ];

  let bestHands = [allHands[0]];
  for (const hand of allHands.slice(1)) {
    const comp = compareHands(hand.result, bestHands[0].result);
    if (comp < 0) bestHands = [hand];
    else if (comp === 0) bestHands.push(hand);
  }

  const updatedComputerHands = computerResults.map(c => ({
    ...c,
    winner: bestHands.some(w => w.name === c.name),
  }));

  setComputerHands(updatedComputerHands);
  setPlayerWinner(bestHands.some(w => w.isPlayer));

  if (bestHands.length === 1) {
    setGameMessage(
      bestHands[0].isPlayer
        ? `🏆 You win with ${bestHands[0].result.name}!`
        : `🤖 ${bestHands[0].name} wins with ${bestHands[0].result.name}!`
    );
  } else {
    const names = bestHands.map(w => (w.isPlayer ? "You" : w.name)).join(", ");
    setGameMessage(`🤝 Tie between ${names} with ${bestHands[0].result.name}!`);
  }
}, [playerHand, communityCards]);

  useEffect(() => {
    if (gameInProgress && communityCards.length === 5) {
      determineWinner(computerHands);
    }
  }, [gameInProgress, communityCards, computerHands, determineWinner]);

  function CardDisplay({ card }: { card: Card }) {
    return (
      <div className={`w-16 h-24 rounded-lg flex flex-col items-center justify-center ${card.suit === "♥️" || card.suit === "♦️" ? "text-red-600" : "text-black"} bg-white shadow-md`}>
        <div className="text-xl font-bold">{card.rank}</div>
        <div className="text-2xl">{card.suit}</div>
      </div>
    );
  }

  return (
    
    <div className="min-h-screen bg-green-900 text-white p-8">
  <h1 className="text-4xl font-bold text-center mb-8">♠️ Texas Hold&apos;em (Head&apos;s up)♣️</h1>

  {step === 0 ? (
  <div className="relative min-h-screen flex items-center justify-center bg-green-900 text-white p-8">

  {/* Poker Image absolutely positioned on the left */}
  <div className="absolute left-8 top-1/2 transform -translate-y-1/2 hidden md:block">
    <Image
      src="/poker.webp"
      alt="Poker"
      width={400}
      height={400}
      unoptimized
      className="rounded-lg object-cover"
    />
  </div>

  {/* Setup Game perfectly centered */}
  <div className="max-w-md w-full bg-green-800 p-8 rounded-xl flex flex-col gap-6 items-center">
    <h2 className="text-3xl font-bold text-center">Setup Game</h2>

    {/* Number of Bots */}
    <div className="flex flex-wrap justify-center gap-2">
      {[0, 1, 2, 3, 4, 5, 6, 7].map((num) => (
        <button
          key={num}
          onClick={() => setNumPlayers(num)}
          className={`px-4 py-2 rounded ${
            numPlayers === num ? "bg-yellow-500 text-black" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {num} Bots
        </button>
      ))}
    </div>

    {/* Custom Bot Names */}
    <div className="w-full">
      <label className="block text-lg mt-4 mb-1 text-center">Custom Bot Names (Not needed):</label>
      <input
        type="text"
        value={customBotNames}
        onChange={(e) => setCustomBotNames(e.target.value)}
        placeholder="e.g. Bot1, Bot2"
        className="w-full p-2 rounded text-black"
      />
    </div>

    {/* Start Game Button */}
    <button
      onClick={startGame}
      className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
    >
      Start Game
    </button>
  </div>
</div>
) : (
  <>
      {/* Player Hand */}
      <div className={`mb-8 p-4 rounded-xl ${playerWinner ? "bg-yellow-800" : "bg-gray-800"}`}>
        <h2 className="text-2xl mb-4">Your Hand {playerWinner && "🏆"}</h2>
        {playerResult && (
          <p className="text-center text-gray-300 italic mb-2">Hand: {playerResult.name}</p>
        )}
        <div className="flex gap-4 justify-center">
          {playerHand.map((card, i) => (
            <CardDisplay key={i} card={card} />
          ))}
        </div>
      </div>

      {/* Community Cards */}
      <div className="mb-8 p-4 bg-gray-800 rounded-xl">
        <h2 className="text-2xl mb-4">Community Cards</h2>
        <div className="flex gap-4 justify-center">
          {communityCards.map((card, i) => (
            <CardDisplay key={i} card={card} />
          ))}
        </div>
      </div>

      {/* Computer Players */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {computerHands.map((bot, i) => (
          <div key={i} className={`p-4 rounded-xl ${bot.winner ? "bg-yellow-800" : "bg-gray-800"}`}>
            <h2 className="text-xl mb-2">
              {bot.name} {bot.winner && "🏆"}
            </h2>
            {bot.result && (
              <p className="text-center text-gray-300 italic mb-2">{bot.result.name}</p>
            )}
            <div className="flex gap-2 justify-center">
              {bot.hand.map((card, j) => (
                <CardDisplay key={j} card={card} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Deal / New Game Buttons */}
      <div className="flex flex-col items-center gap-4 mb-8">
        {step < 4 && (
          <button
            onClick={dealNext}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
          >
            {["Deal Flop", "Deal Turn", "Deal River"][step - 1]}
          </button>
        )}

        {step >= 4 && (
          <button
            onClick={startGame}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded"
          >
            🔁 New Game
          </button>
        )}
      </div>

      {/* Winner Message */}
      {gameMessage && (
        <div className="text-center p-4 bg-blue-800 rounded-xl mt-4">
          <h2 className="text-2xl font-bold">{gameMessage}</h2>
        </div>
      )}
    </>
  )}
</div>
  );
}
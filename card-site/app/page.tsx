"use client";

import { useState } from "react";

// Deck setup
const suits = ["♠️", "♥️", "♣️", "♦️"];
const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const botNames = [
  "AceBot", "LuckyBot", "SharkBot", "QueenBot", "BluffBot",
  "DealerBot", "RiverKing", "FlopMaster", "TheGrinder", "HighRoller"
];

function getDeck() {
  const deck = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ rank, suit });
    }
  }
  return deck;
}

function shuffle(deck: { rank: string; suit: string }[]) {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function Home() {
  const [deck, setDeck] = useState<{ rank: string; suit: string }[]>([]);
  const [playerHand, setPlayerHand] = useState<{ rank: string; suit: string }[]>([]);
  const [computerHands, setComputerHands] = useState<{ name: string; hand: { rank: string; suit: string }[]; winner: boolean }[]>([]);
  const [communityCards, setCommunityCards] = useState<{ rank: string; suit: string }[]>([]);
  const [gameMessage, setGameMessage] = useState("");
  const [step, setStep] = useState(0);
  const [numPlayers, setNumPlayers] = useState(1);
  const [playerWinner, setPlayerWinner] = useState(false);

  function startGame() {
    const newDeck = shuffle(getDeck());
    const player = [newDeck.pop()!, newDeck.pop()!];
    const computers = [];

    for (let i = 0; i < numPlayers; i++) {
      const botName = botNames[Math.floor(Math.random() * botNames.length)];
      computers.push({
        name: botName,
        hand: [newDeck.pop()!, newDeck.pop()!],
        winner: false,
      });
    }

    setDeck(newDeck);
    setPlayerHand(player);
    setComputerHands(computers);
    setCommunityCards([]);
    setGameMessage("");
    setStep(1);
    setPlayerWinner(false);
  }

  function nextStep() {
    const newDeck = [...deck];

    if (step === 1) {
      const flop = [newDeck.pop()!, newDeck.pop()!, newDeck.pop()!];
      setCommunityCards(flop);
      setDeck(newDeck);
      setStep(2);
    } else if (step === 2) {
      const turn = newDeck.pop()!;
      setCommunityCards((prev) => [...prev, turn]);
      setDeck(newDeck);
      setStep(3);
    } else if (step === 3) {
      const river = newDeck.pop()!;
      setCommunityCards((prev) => [...prev, river]);
      setDeck(newDeck);
      setStep(4);
    } else if (step === 4) {
      decideWinner();
      setStep(5);
    }
  }
  function decideWinner() {
    const playerTotal = handValue([...playerHand, ...communityCards]);
    const computerTotals = computerHands.map(comp => handValue([...comp.hand, ...communityCards]));
    const allTotals = [playerTotal, ...computerTotals];
    const highestTotal = Math.max(...allTotals);
  
    const updatedComputers = computerHands.map((comp, idx) => ({
      ...comp,
      winner: computerTotals[idx] === highestTotal,
    }));
  
    setComputerHands(updatedComputers);
    setPlayerWinner(playerTotal === highestTotal && allTotals.filter(t => t === highestTotal).length === 1);
  
    if (playerTotal === highestTotal && allTotals.filter(t => t === highestTotal).length === 1) {
      setGameMessage("You Win! 🏆");
    } else if (playerTotal === highestTotal) {
      setGameMessage("It's a Tie! 🤝");
    } else {
      // Find which bot(s) won
      const winningBots = updatedComputers
        .filter(bot => bot.winner)
        .map(bot => bot.name)
        .join(", ");
  
      setGameMessage(`${winningBots} Wins! 🤖🏆`);
    }
  }
  function handValue(hand: { rank: string; suit: string }[]) {
    const rankValues: Record<string, number> = {
      A: 14, K: 13, Q: 12, J: 11, "10": 10, "9": 9, "8": 8,
      "7": 7, "6": 6, "5": 5, "4": 4, "3": 3, "2": 2,
    };
    return hand.reduce((sum, card) => sum + (rankValues[card.rank] || 0), 0);
  }

  function resetGame() {
    setDeck([]);
    setPlayerHand([]);
    setComputerHands([]);
    setCommunityCards([]);
    setGameMessage("");
    setStep(0);
    setPlayerWinner(false);
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-green-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">♠️ Poker Game ♣️</h1>

      {step === 0 && (
        <div className="flex flex-col items-center mb-8">
          <label className="text-lg mb-4">🧑‍💻 How many bots to play against? (1-8)</label>
          <input
            type="number"
            min="1"
            max="8"
            value={numPlayers}
            onChange={(e) => setNumPlayers(parseInt(e.target.value))}
            className="text-black px-4 py-2 rounded-lg mb-6 w-24 text-center border-2 border-white bg-white"
          />
          <button
            onClick={startGame}
            className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors"
          >
            Start Game
          </button>
        </div>
      )}

      {playerHand.length > 0 && (
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-2xl mb-2">
            You 🧑‍💻 {playerWinner && <span className="text-yellow-400">(Winner 🏆)</span>}
          </h2>
          <div className="flex space-x-4">
            {playerHand.map((card, idx) => (
              <div key={idx} className="bg-white text-black w-20 h-28 rounded-lg shadow-lg flex flex-col items-center justify-center text-2xl">
                <div>{card.rank}</div>
                <div>{card.suit}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {computerHands.length > 0 && (
        <div className={`grid ${computerHands.length <= 4 ? "grid-cols-2" : "grid-cols-3"} gap-6 mb-8`}>
          {computerHands.map((comp, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <h2 className="text-xl mb-2">
                {comp.name} 🤖 {comp.winner && <span className="text-yellow-400">(Winner 🏆)</span>}
              </h2>
              <div className="flex space-x-2">
                {comp.hand.map((card, cardIdx) => (
                  <div key={cardIdx} className="bg-white text-black w-16 h-24 rounded-lg shadow-md flex flex-col items-center justify-center text-lg">
                    <div>{card.rank}</div>
                    <div>{card.suit}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {communityCards.length > 0 && (
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-2xl mb-4">Community Cards 🃏</h2>
          <div className="flex space-x-4">
            {communityCards.map((card, idx) => (
              <div key={idx} className="bg-white text-black w-20 h-28 rounded-lg shadow-lg flex flex-col items-center justify-center text-2xl">
                <div>{card.rank}</div>
                <div>{card.suit}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {step >= 1 && step <= 4 && (
        <button
          onClick={nextStep}
          className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors mb-6"
        >
          {step === 1 && "Deal Flop"}
          {step === 2 && "Deal Turn"}
          {step === 3 && "Deal River"}
          {step === 4 && "Show Winner"}
        </button>
      )}

      {gameMessage && (
        <>
          <h2 className="text-2xl font-bold mb-4">{gameMessage}</h2>
          <button
            onClick={resetGame}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors"
          >
            Play Again 🔁
          </button>
        </>
      )}
    </main>
  );
}
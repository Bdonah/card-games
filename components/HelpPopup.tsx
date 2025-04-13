"use client";

import React from "react";

type HelpPopupProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function HelpPopup({ isOpen, onClose }: HelpPopupProps) {
  if (!isOpen) return null; // If not open, don't render anything

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white text-black p-8 rounded-lg shadow-lg max-w-md w-full relative">
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 text-2xl font-bold text-gray-500 hover:text-gray-800"
        >
          ✖️
        </button>

        <h2 className="text-3xl font-bold mb-4 text-center">❓ Help</h2>
        
        <div className="space-y-4 text-lg">
          <p><strong>♠️ Poker:</strong> Pick bots and play Texas Hold&apos;em!</p>
          <p><strong>🎡 Roulette:</strong> Bet red, black, odd, even, or a number. Spin the wheel!</p>
          <p><strong>🃏 Blackjack:</strong> Try to beat the dealer without going over 21.</p>
          <p><strong>🎰 Slots:</strong> Spin the machine. 3 matching symbols = Jackpot!</p>
          <p><strong>🃏 Video Poker:</strong> Hold the best cards and draw for a winning hand.</p>
          <p><strong>🎲 Craps:</strong> Roll two dice. Roll a 7 or 11 on the first try to win, or a 2, 3, or 12 to lose. Otherwise, your roll becomes your &quot;point&quot; — keep rolling to match your point again before hitting a 7!</p>
        </div>
      </div>
    </div>
  );
}
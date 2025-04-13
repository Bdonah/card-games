"use client";

import { useState } from "react";
import HelpPopup from "@/components/HelpPopup";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [showHelp, setShowHelp] = useState(false);

  function togglePopup() {
    setShowHelp(prev => !prev);
  }

  return (
    <div className="relative min-h-screen bg-green-900 text-white">
      {/* Help Popup */}
      <HelpPopup isOpen={showHelp} onClose={togglePopup} />

      {/* Help Button */}
      <button
        onClick={togglePopup}
        className="fixed top-4 right-4 bg-yellow-400 text-black rounded-full p-2 w-10 h-10 flex items-center justify-center shadow-lg hover:bg-yellow-500 z-50"
      >
        ?
      </button>

      {/* Main Content */}
      {children}
    </div>
  );
}
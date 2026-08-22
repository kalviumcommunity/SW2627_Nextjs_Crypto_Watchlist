"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, Settings, Wallet } from "lucide-react";
import { useState } from "react";

export default function NavBar() {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const isMarketsActive = pathname === "/markets";
  const isWatchlistActive = pathname === "/watchlist";

  return (
    <header className="h-[56px] bg-[#10131C] border-b border-[#232B3A] px-4 md:px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Left: Brand Logo & Global Search */}
      <div className="flex items-center gap-4 lg:gap-6">
        <Link href="/markets" className="flex items-center flex-shrink-0">
          <span className="text-xl md:text-2xl font-bold tracking-tight">
            <span className="text-white">Coin</span>
            <span className="text-[#FF5446]">DCX</span>
          </span>
        </Link>

        {/* Inline Global Search Input */}
        <div className="relative hidden sm:flex items-center">
          <Search className="w-4 h-4 text-[#9AA4B2] absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search markets..."
            className="w-40 md:w-56 lg:w-64 h-9 pl-9 pr-4 bg-[#111827] text-white text-xs md:text-sm rounded-full border border-[#232B3A] focus:outline-none focus:border-[#FF5446] transition-colors placeholder:text-[#5B6472]"
          />
        </div>
      </div>

      {/* Center Nav Links */}
      <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-[14px] font-medium h-full">
        <Link
          href="/markets"
          className={`relative h-full flex items-center transition-colors ${
            isMarketsActive
              ? "text-[#FF5446] font-semibold"
              : "text-[#9AA4B2] hover:text-white"
          }`}
        >
          Markets
          {isMarketsActive && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FF5446]" />
          )}
        </Link>

        <Link
          href="/watchlist"
          className={`relative h-full flex items-center transition-colors ${
            isWatchlistActive
              ? "text-[#FF5446] font-semibold"
              : "text-[#9AA4B2] hover:text-white"
          }`}
        >
          Watchlist
          {isWatchlistActive && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FF5446]" />
          )}
        </Link>

        <Link href="#" className="text-[#9AA4B2] hover:text-white transition-colors">
          Trade
        </Link>
        <Link href="#" className="text-[#9AA4B2] hover:text-white transition-colors">
          Futures
        </Link>
        <Link href="#" className="text-[#9AA4B2] hover:text-white transition-colors">
          Assets
        </Link>
        <Link href="#" className="text-[#9AA4B2] hover:text-white transition-colors">
          Staking
        </Link>
      </nav>

      {/* Right Side Icons & Auth Controls */}
      <div className="flex items-center gap-3 md:gap-4">
        <button
          aria-label="Wallet"
          className="text-[#9AA4B2] hover:text-white transition-colors p-1.5 rounded-lg hover:bg-[#111827]"
        >
          <Wallet className="w-5 h-5" />
        </button>
        <button
          aria-label="Notifications"
          className="text-[#9AA4B2] hover:text-white transition-colors p-1.5 rounded-lg hover:bg-[#111827]"
        >
          <Bell className="w-5 h-5" />
        </button>
        <button
          aria-label="Settings"
          className="text-[#9AA4B2] hover:text-white transition-colors p-1.5 rounded-lg hover:bg-[#111827]"
        >
          <Settings className="w-5 h-5" />
        </button>

        {isAuthenticated ? (
          <div className="flex items-center gap-3 pl-2 border-l border-[#232B3A]">
            <span
              onClick={() => setIsAuthenticated(false)}
              title="Click to toggle Auth state demo"
              className="hidden sm:inline-block text-white text-[14px] font-medium tabular-nums cursor-pointer hover:text-[#FF5446] transition-colors"
            >
              ₹50,000.00
            </span>
            <div
              onClick={() => setIsAuthenticated(false)}
              title="Click to toggle Auth state demo"
              className="w-8 h-8 rounded-full bg-[#FF5446] text-white flex items-center justify-center font-bold text-xs cursor-pointer hover:opacity-90 transition-opacity"
            >
              CD
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 pl-2 border-l border-[#232B3A]">
            <button
              onClick={() => setIsAuthenticated(true)}
              className="px-3 py-1.5 text-xs md:text-sm font-medium text-[#9AA4B2] hover:text-white transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => setIsAuthenticated(true)}
              className="px-3.5 py-1.5 text-xs md:text-sm font-bold text-white bg-[#FF5446] hover:bg-[#D63A2F] rounded-lg transition-colors"
            >
              Register
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

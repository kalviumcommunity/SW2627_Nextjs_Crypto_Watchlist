"use client";

import Link from "next/link";
import { Bell, Settings } from "lucide-react";

export default function NavBar() {
  return (
    <header className="h-[56px] bg-[#10131C] border-b border-[#232B3A] px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Left: Brand Logo & Links */}
      <div className="flex items-center gap-9">
        <Link href="/watchlist" className="flex items-center">
          <span className="text-2xl font-bold tracking-tight">
            <span className="text-white">Coin</span>
            <span className="text-[#FF5446]">DCX</span>
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-[14px] font-medium">
          <Link
            href="/watchlist"
            className="relative text-[#FF5446] py-4 flex items-center font-medium"
          >
            Markets
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FF5446]" />
          </Link>
          <Link href="#" className="text-[#9AA4B2] hover:text-white transition-colors">
            Coins
          </Link>
          <Link href="#" className="text-[#9AA4B2] hover:text-white transition-colors">
            Futures
          </Link>
          <Link href="#" className="text-[#9AA4B2] hover:text-white transition-colors">
            Options
          </Link>
          <Link href="#" className="text-[#9AA4B2] hover:text-white transition-colors">
            Earn
          </Link>
        </nav>
      </div>

      {/* Right Side: Balance, Icons & Profile */}
      <div className="flex items-center gap-5">
        <span className="text-white text-[15px] font-medium tabular-nums">
          ₹50,000.00
        </span>
        <button
          aria-label="Notifications"
          className="text-[#9AA4B2] hover:text-white transition-colors p-1"
        >
          <Bell className="w-5 h-5" />
        </button>
        <button
          aria-label="Settings"
          className="text-[#9AA4B2] hover:text-white transition-colors p-1"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-[#FF5446] text-white flex items-center justify-center font-bold text-xs">
          CD
        </div>
      </div>
    </header>
  );
}

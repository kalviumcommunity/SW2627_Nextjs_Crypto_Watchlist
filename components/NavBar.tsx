"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, Bell, Settings, User, X, LogOut } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import AutocompleteDropdown from "./search/AutocompleteDropdown";

function GlobalNavSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync with q URL param if on /markets or /watchlist
  useEffect(() => {
    if (pathname === "/markets" || pathname === "/watchlist") {
      setText(searchParams.get("q") || "");
    }
  }, [searchParams, pathname]);

  const handleApplyQuery = (queryVal: string) => {
    const trimmed = queryVal.trim();
    if (pathname === "/markets" || pathname === "/watchlist") {
      const params = new URLSearchParams(searchParams.toString());
      if (trimmed) {
        params.set("q", trimmed);
      } else {
        params.delete("q");
      }
      params.delete("page");
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    } else {
      if (trimmed) {
        router.push(`/markets?q=${encodeURIComponent(trimmed)}`);
      } else {
        router.push("/markets");
      }
    }
  };

  const handleClear = () => {
    setText("");
    handleApplyQuery("");
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <div className="relative hidden sm:flex items-center">
      <Search className="w-4 h-4 text-[#9AA4B2] absolute left-3 pointer-events-none z-10" />
      <input
        ref={inputRef}
        type="text"
        value={text}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        onChange={(e) => {
          const val = e.target.value;
          setText(val);
          if (pathname === "/markets" || pathname === "/watchlist") {
            handleApplyQuery(val);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleApplyQuery(text);
            setIsFocused(false);
          }
        }}
        placeholder="Search markets..."
        className="w-40 md:w-56 lg:w-64 h-9 pl-9 pr-8 bg-[#111827] text-white text-xs md:text-sm rounded-full border border-[#232B3A] focus:outline-none focus:border-[#FF5446] transition-colors placeholder:text-[#5B6472]"
      />

      {text && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9AA4B2] hover:text-white transition-colors cursor-pointer p-0.5 rounded-full z-10"
          title="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}

      <AutocompleteDropdown
        query={text}
        isOpen={isFocused && text.trim().length > 0}
        onClose={() => setIsFocused(false)}
        onSelectText={(selectVal) => {
          setText(selectVal);
          handleApplyQuery(selectVal);
        }}
      />
    </div>
  );
}

export default function NavBar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  const isMarketsActive = pathname === "/markets";
  const isCoinsActive = pathname.startsWith("/coins");
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
        <GlobalNavSearch />
      </div>

      {/* Center Nav Links: Markets · Coins · Futures · Options · Earn */}
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
          href="/coins/eth"
          className={`relative h-full flex items-center transition-colors ${
            isCoinsActive
              ? "text-[#FF5446] font-semibold"
              : "text-[#9AA4B2] hover:text-white"
          }`}
        >
          Coins
          {isCoinsActive && (
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
          Futures
        </Link>
        <Link href="#" className="text-[#9AA4B2] hover:text-white transition-colors">
          Options
        </Link>
        <Link href="#" className="text-[#9AA4B2] hover:text-white transition-colors">
          Earn
        </Link>
      </nav>

      {/* Right Side Controls */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* BTC Price Pill */}
        <div className="hidden md:flex items-center px-3 py-1 bg-[#111827] border border-[#232B3A] rounded-md text-xs font-mono text-[#9AA4B2]">
          <span>BTC:&nbsp;</span>
          <span className="text-white font-semibold">$42,069.00</span>
        </div>

        <button
          aria-label="Notifications"
          className="text-[#9AA4B2] hover:text-white transition-colors p-1.5 rounded-lg hover:bg-[#111827]"
        >
          <Bell className="w-4 h-4" />
        </button>
        <button
          aria-label="Settings"
          className="text-[#9AA4B2] hover:text-white transition-colors p-1.5 rounded-lg hover:bg-[#111827]"
        >
          <Settings className="w-4 h-4" />
        </button>

        {isAuthenticated ? (
          <div className="flex items-center gap-3 pl-2 border-l border-[#232B3A]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#1B2536] border border-[#232B3A] flex items-center justify-center text-white font-bold text-xs">
                {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
              </div>
              <span className="hidden sm:inline-block text-xs font-medium text-white max-w-[100px] truncate">
                {session?.user?.name || session?.user?.email || "Profile"}
              </span>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              title="Log Out"
              aria-label="Log Out"
              className="text-[#9AA4B2] hover:text-[#FF5446] transition-colors p-1 rounded hover:bg-[#111827]"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 pl-2 border-l border-[#232B3A]">
            <Link
              href="/login"
              className="px-3 py-1.5 text-xs md:text-sm font-medium text-[#9AA4B2] hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-3.5 py-1.5 text-xs md:text-sm font-bold text-white bg-[#FF5446] hover:bg-[#D63A2F] rounded-lg transition-colors"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}


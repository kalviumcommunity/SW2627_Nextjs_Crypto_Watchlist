"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, Bell, Settings, User, X, LogOut, Menu } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import AutocompleteDropdown from "./search/AutocompleteDropdown";

function GlobalNavSearch({
  containerClassName = "",
  inputClassName = "",
  onSelect,
}: {
  containerClassName?: string;
  inputClassName?: string;
  onSelect?: () => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentQuery =
    pathname === "/markets" || pathname === "/watchlist"
      ? searchParams.get("q") || ""
      : "";
  const [prevQuery, setPrevQuery] = useState(currentQuery);
  const [text, setText] = useState(currentQuery);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  if (prevQuery !== currentQuery) {
    setPrevQuery(currentQuery);
    setText(currentQuery);
  }

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
    onSelect?.();
  };

  const handleClear = () => {
    setText("");
    handleApplyQuery("");
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <div className={`relative items-center ${containerClassName}`}>
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
        className={`h-9 pl-9 pr-8 bg-[#111827] text-white text-xs md:text-sm rounded-full border border-[#232B3A] focus:outline-none focus:border-[#FF5446] focus:ring-1 focus:ring-[#FF5446]/30 transition-all placeholder:text-[#5B6472] ${inputClassName}`}
      />

      {text && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9AA4B2] hover:text-white transition-colors cursor-pointer p-0.5 rounded-full z-10 hover:bg-[#1B2536]"
          title="Clear search"
          aria-label="Clear search"
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close drawer on Escape key press or browser navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };
    const handlePopState = () => {
      setIsMobileMenuOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const isMarketsActive = pathname === "/markets";
  const isCoinsActive = pathname.startsWith("/coins");
  const isWatchlistActive = pathname === "/watchlist";

  const navLinks = [
    { label: "Markets", href: "/markets", active: isMarketsActive },
    { label: "Coins", href: "/coins/eth", active: isCoinsActive },
    { label: "Watchlist", href: "/watchlist", active: isWatchlistActive },
    { label: "Futures", href: "#", active: false },
    { label: "Options", href: "#", active: false },
    { label: "Earn", href: "#", active: false },
  ];

  return (
    <>
      <header className="h-[56px] bg-[#10131C]/95 backdrop-blur-md border-b border-[#232B3A] px-3 sm:px-4 md:px-6 flex items-center justify-between sticky top-0 z-40 transition-colors">
        {/* Left: Hamburger (mobile) + Brand Logo + Desktop Search */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6">
          {/* Mobile hamburger toggle */}
          <button
            type="button"
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#9AA4B2] hover:text-white hover:bg-[#1B2536] transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#FF5446]/40"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-[#FF5446]" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          <Link
            href="/markets"
            className="flex items-center flex-shrink-0 group focus:outline-none"
          >
            <span className="text-xl md:text-2xl font-bold tracking-tight transition-transform group-hover:scale-[1.02]">
              <span className="text-white">Coin</span>
              <span className="text-[#FF5446]">DCX</span>
            </span>
          </Link>

          {/* Inline Desktop Global Search Input */}
          <GlobalNavSearch
            containerClassName="hidden md:flex"
            inputClassName="w-44 lg:w-64"
          />
        </div>

        {/* Center Nav Links: Desktop / Tablet */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-7 xl:gap-8 text-[14px] font-medium h-full">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`relative h-full flex items-center transition-colors ${
                link.active
                  ? "text-[#FF5446] font-semibold"
                  : "text-[#9AA4B2] hover:text-white"
              }`}
            >
              <span>{link.label}</span>
              {link.active && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FF5446] rounded-t-full shadow-[0_0_8px_#FF5446]" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right Side Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 md:gap-3">
          {/* BTC Price Pill (Hidden on tablet & mobile) */}
          <div className="hidden xl:flex items-center px-3 py-1 bg-[#111827] border border-[#232B3A] rounded-full text-xs font-mono text-[#9AA4B2] shadow-xs">
            <span>BTC:&nbsp;</span>
            <span className="text-white font-semibold tabular-nums">$42,069.00</span>
          </div>

          <button
            aria-label="Notifications"
            className="hidden sm:flex text-[#9AA4B2] hover:text-white transition-colors p-2 rounded-lg hover:bg-[#111827] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#FF5446]/40"
          >
            <Bell className="w-4 h-4" />
          </button>
          <button
            aria-label="Settings"
            className="hidden sm:flex text-[#9AA4B2] hover:text-white transition-colors p-2 rounded-lg hover:bg-[#111827] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#FF5446]/40"
          >
            <Settings className="w-4 h-4" />
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2 pl-1.5 sm:pl-2 sm:border-l sm:border-[#232B3A]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#1B2536] border border-[#232B3A] flex items-center justify-center text-white font-bold text-xs shadow-xs">
                  {session?.user?.name ? (
                    session.user.name.charAt(0).toUpperCase()
                  ) : (
                    <User className="w-3.5 h-3.5" />
                  )}
                </div>
                <span className="hidden lg:inline-block text-xs font-medium text-white max-w-[100px] truncate">
                  {session?.user?.name || session?.user?.email || "Profile"}
                </span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                title="Log Out"
                aria-label="Log Out"
                className="hidden sm:flex text-[#9AA4B2] hover:text-[#FF5446] transition-colors p-1.5 rounded-md hover:bg-[#111827] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#FF5446]/40"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2 pl-1.5 sm:pl-2 sm:border-l sm:border-[#232B3A]">
              <Link
                href="/login"
                className="px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs md:text-sm font-medium text-[#9AA4B2] hover:text-white transition-colors rounded-lg hover:bg-[#111827]"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-3 sm:px-3.5 py-1 sm:py-1.5 text-xs md:text-sm font-bold text-white bg-[#FF5446] hover:bg-[#D63A2F] active:scale-95 rounded-lg transition-all shadow-sm"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Drawer / Dropdown (< 768px) */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Menu Dropdown Sheet */}
          <div className="fixed top-[56px] left-0 right-0 max-h-[calc(100vh-56px)] overflow-y-auto bg-[#10131C] border-b border-[#232B3A] shadow-2xl p-4 md:hidden z-50 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200">
            {/* Mobile Search */}
            <div className="w-full">
              <GlobalNavSearch
                containerClassName="flex w-full"
                inputClassName="w-full"
                onSelect={() => setIsMobileMenuOpen(false)}
              />
            </div>

            {/* Nav Links */}
            <div className="flex flex-col gap-1 py-1 border-t border-[#232B3A]/60">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
                    link.active
                      ? "bg-[#FF5446]/10 text-[#FF5446] font-semibold"
                      : "text-[#9AA4B2] hover:bg-[#1B2536] hover:text-white"
                  }`}
                >
                  <span>{link.label}</span>
                  {link.active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF5446]" />
                  )}
                </Link>
              ))}
            </div>

            {/* Secondary Controls: BTC pill + Alerts & Settings */}
            <div className="flex items-center justify-between pt-3 border-t border-[#232B3A]/60 text-xs">
              <div className="flex items-center px-3 py-1.5 bg-[#111827] border border-[#232B3A] rounded-full font-mono text-[#9AA4B2]">
                <span>BTC:&nbsp;</span>
                <span className="text-white font-semibold tabular-nums">
                  $42,069.00
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  aria-label="Notifications"
                  className="text-[#9AA4B2] hover:text-white p-2 rounded-lg hover:bg-[#1B2536] transition-colors cursor-pointer"
                >
                  <Bell className="w-4 h-4" />
                </button>
                <button
                  aria-label="Settings"
                  className="text-[#9AA4B2] hover:text-white p-2 rounded-lg hover:bg-[#1B2536] transition-colors cursor-pointer"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Auth Section in Drawer */}
            <div className="pt-3 border-t border-[#232B3A]/60">
              {isAuthenticated ? (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#111827] border border-[#232B3A]">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-[#1B2536] border border-[#232B3A] flex items-center justify-center text-white font-bold text-xs shrink-0">
                      {session?.user?.name ? (
                        session.user.name.charAt(0).toUpperCase()
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-white truncate">
                        {session?.user?.name || "User"}
                      </span>
                      <span className="text-[10px] text-[#5B6472] truncate">
                        {session?.user?.email || ""}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      signOut({ callbackUrl: "/login" });
                    }}
                    className="flex items-center gap-1.5 text-xs text-[#FF5446] hover:text-[#D63A2F] px-2.5 py-1.5 rounded-md hover:bg-[#FF5446]/10 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log out</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="h-10 flex items-center justify-center text-sm font-semibold text-[#9AA4B2] hover:text-white bg-[#111827] border border-[#232B3A] rounded-lg transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="h-10 flex items-center justify-center text-sm font-bold text-white bg-[#FF5446] hover:bg-[#D63A2F] rounded-lg transition-colors shadow-sm"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

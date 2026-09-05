"use client";

import { useEffect, useState, useRef, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { SearchX } from "lucide-react";
import { CoinDTO } from "@/types/watchlist";

interface AutocompleteDropdownProps {
  query: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectText: (text: string) => void;
}

export default function AutocompleteDropdown({
  query,
  isOpen,
  onClose,
  onSelectText,
}: AutocompleteDropdownProps) {
  const router = useRouter();
  const [suggestions, setSuggestions] = useState<CoinDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [prevQuery, setPrevQuery] = useState(query);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (prevQuery !== query || prevIsOpen !== isOpen) {
    setPrevQuery(query);
    setPrevIsOpen(isOpen);
    if (!query.trim() || !isOpen) {
      setSuggestions([]);
      setSelectedIndex(-1);
    }
  }

  // Fetch up to 8 autocomplete suggestions when query changes
  useEffect(() => {
    if (!query.trim() || !isOpen) {
      return;
    }

    let isMounted = true;

    const timer = setTimeout(async () => {
      try {
        if (isMounted) setLoading(true);
        const res = await fetch(`/api/coins?q=${encodeURIComponent(query)}&limit=8`);
        if (!res.ok) throw new Error("Failed to fetch autocomplete");
        const data = await res.json();
        if (isMounted) {
          setSuggestions(data.items || []);
          setSelectedIndex(-1);
        }
      } catch (err) {
        console.error("Autocomplete fetch error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }, 150);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [query, isOpen]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !query.trim()) return null;

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        const coin = suggestions[selectedIndex];
        router.push(`/coins/${coin.symbol}`);
        onClose();
      } else {
        onSelectText(query);
        onClose();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 100) {
      return `₹${price.toLocaleString("en-IN", {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      })}`;
    }
    return `₹${price.toFixed(4)}`;
  };

  return (
    <div
      ref={dropdownRef}
      tabIndex={-1}
      role="listbox"
      aria-label="Search suggestions"
      onKeyDown={handleKeyDown}
      className="absolute top-full left-0 right-0 mt-1 z-50 bg-[#111827] border border-[#232B3A] rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.45)] max-h-[300px] overflow-y-auto outline-none py-1 transition-all"
    >
      {loading && suggestions.length === 0 ? (
        <div className="p-2 space-y-1.5 animate-pulse" role="status" aria-label="Loading suggestions">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="px-2.5 py-2 flex items-center justify-between gap-3 rounded-md"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-6 h-6 rounded-full bg-[#1B2536] shrink-0" />
                <div className="space-y-1">
                  <div className="w-20 h-3 bg-[#1B2536] rounded" />
                  <div className="w-12 h-2 bg-[#1B2536] rounded" />
                </div>
              </div>
              <div className="w-14 h-3 bg-[#1B2536] rounded shrink-0" />
            </div>
          ))}
        </div>
      ) : suggestions.length === 0 ? (
        <div className="px-4 py-5 flex flex-col items-center justify-center text-center gap-1.5" role="status">
          <SearchX className="w-6 h-6 text-[#9AA4B2] mb-0.5" aria-hidden="true" />
          <span className="text-xs font-semibold text-white">
            No coins found for &quot;{query}&quot;
          </span>
          <span className="text-[11px] text-[#9AA4B2]">
            Try searching by symbol (BTC, ETH) or name
          </span>
        </div>
      ) : (
        suggestions.map((coin, index) => {
          const isSelected = index === selectedIndex;
          return (
            <div
              key={coin.id}
              role="option"
              aria-selected={isSelected}
              onClick={() => {
                router.push(`/coins/${coin.symbol}`);
                onClose();
              }}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`px-3 py-2.5 flex items-center justify-between cursor-pointer transition-colors text-xs border-b border-[#232B3A]/30 last:border-b-0 ${
                isSelected
                  ? "bg-[#1B2536] text-white"
                  : "hover:bg-[#1B2536]/60 text-[#D1D5DB]"
              }`}
            >
              {/* Left: Icon / Symbol & Name */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-6 h-6 rounded-full bg-[#1B2536] border border-[#232B3A] flex items-center justify-center text-[10px] font-bold text-[#F5B94D] shrink-0" aria-hidden="true">
                  {coin.symbol.slice(0, 3)}
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white truncate">
                      {coin.name}
                    </span>
                    <span className="text-[10px] text-[#9AA4B2] uppercase font-mono">
                      {coin.symbol}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#9AA4B2] truncate">
                    {coin.subtext}
                  </span>
                </div>
              </div>

              {/* Right: Price */}
              <div className="text-right font-medium text-white font-mono shrink-0 ml-2">
                {formatPrice(coin.priceInr)}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import AutocompleteDropdown from "./search/AutocompleteDropdown";

interface SearchInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search coin or pair...",
}: SearchInputProps) {
  const [prevValue, setPrevValue] = useState(value);
  const [localValue, setLocalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  if (prevValue !== value) {
    setPrevValue(value);
    setLocalValue(value);
  }

  // Debounced 200ms
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, 200);

    return () => clearTimeout(handler);
  }, [localValue, onChange, value]);

  const handleClear = () => {
    setLocalValue("");
    onChange("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="relative w-full sm:w-[260px] h-9 shrink-0">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9AA4B2] pointer-events-none" aria-hidden="true" />
      
      <input
        ref={inputRef}
        type="text"
        value={localValue}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          // Delay blur slightly to allow click event on autocomplete suggestions
          setTimeout(() => setIsFocused(false), 200);
        }}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder || "Search coin or pair"}
        className="w-full h-full bg-[#10131C] border border-[#232B3A] hover:border-[#374151] rounded-lg pl-9 pr-8 text-xs text-white placeholder-[#5B6472] focus:outline-none focus:border-[#FF5446] focus:ring-1 focus:ring-[#FF5446]/30 transition-all shadow-xs"
      />

      {/* Clear 'x' Button */}
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-[#9AA4B2] hover:text-white transition-colors cursor-pointer p-1 rounded-md hover:bg-[#1B2536]"
          title="Clear search"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      )}

      {/* Autocomplete Dropdown */}
      <AutocompleteDropdown
        query={localValue}
        isOpen={isFocused && localValue.trim().length > 0}
        onClose={() => setIsFocused(false)}
        onSelectText={(text) => {
          setLocalValue(text);
          onChange(text);
        }}
      />
    </div>
  );
}



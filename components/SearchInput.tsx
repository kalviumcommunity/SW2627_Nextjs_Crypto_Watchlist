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
  const [localValue, setLocalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

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
    <div className="relative w-full sm:w-[260px] h-[36px] shrink-0">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9AA4B2] pointer-events-none" />
      
      <input
        ref={inputRef}
        type="text"
        value={localValue}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          // Delay blur slightly to allow click event on autocomplete suggestions
          setTimeout(() => setIsFocused(false), 200);
        }}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="w-full h-full bg-[#10131C] border border-[#232B3A] rounded-lg pl-9 pr-8 text-xs text-white placeholder-[#9AA4B2] focus:outline-none focus:border-[#FF5446] transition-colors"
      />

      {/* Clear 'x' Button */}
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9AA4B2] hover:text-white transition-colors cursor-pointer p-0.5 rounded-full"
          title="Clear search"
        >
          <X className="w-3.5 h-3.5" />
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


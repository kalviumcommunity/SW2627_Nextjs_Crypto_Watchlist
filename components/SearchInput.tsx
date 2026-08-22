"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";

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

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(localValue);
    }, 150);

    return () => clearTimeout(handler);
  }, [localValue, onChange]);

  return (
    <div className="relative w-full sm:w-[260px] h-[36px]">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5B6472]" />
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="w-full h-full bg-[#10131C] border border-[#232B3A] rounded-full pl-9 pr-4 text-sm text-white placeholder-[#5B6472] focus:outline-none focus:border-[#FF5446] transition-colors"
      />
    </div>
  );
}

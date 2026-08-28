"use client";

import { useState } from "react";
import { Eye, EyeOff, Check, X } from "lucide-react";

interface PasswordInputProps {
  id: string;
  name?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  label?: string;
  headerRight?: React.ReactNode;
  showStrengthMeter?: boolean;
}

export default function PasswordInput({
  id,
  name = "password",
  value,
  onChange,
  onBlur,
  placeholder = "••••••••",
  error,
  label = "Password",
  headerRight,
  showStrengthMeter = false,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  // Requirements check logic
  const hasMinLength = value.length >= 8;
  const hasNumber = /\d/.test(value);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(value);

  // Strength score (0 to 4)
  let score = 0;
  if (value.length > 0) {
    if (value.length >= 6) score += 1;
    if (hasMinLength) score += 1;
    if (hasNumber) score += 1;
    if (hasSpecialChar) score += 1;
  }

  // Label & color mapping
  let strengthLabel = "Weak";
  let barColorClass = "bg-[#E5484D]";
  let textColorClass = "text-[#E5484D]";

  if (score >= 4) {
    strengthLabel = "Strong";
    barColorClass = "bg-[#1FB878]";
    textColorClass = "text-[#1FB878]";
  } else if (score >= 2) {
    strengthLabel = "Medium";
    barColorClass = "bg-[#F5B94D]";
    textColorClass = "text-[#F5B94D]";
  }

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {/* Label Row */}
      <div className="flex items-center justify-between">
        {label && (
          <label
            htmlFor={id}
            className="text-[13px] font-medium text-[#9AA4B2]"
          >
            {label}
          </label>
        )}
        {headerRight}
      </div>

      {/* Input container */}
      <div className="relative w-full">
        <input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full h-[44px] px-4 pr-11 bg-[#111827] text-white text-sm rounded-lg border transition-colors placeholder:text-[#5B6472] focus:outline-none ${
            error
              ? "border-[#E5484D] focus:border-[#E5484D]"
              : "border-[#232B3A] focus:border-[#3B82F6]"
          }`}
        />

        {/* Visibility Toggle Eye Icon */}
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5B6472] hover:text-[#9AA4B2] transition-colors p-1 rounded cursor-pointer"
          title={showPassword ? "Hide password" : "Show password"}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Direct Validation Error Text */}
      {error && !showStrengthMeter && (
        <span id={`${id}-error`} className="text-xs text-[#E5484D]">
          {error}
        </span>
      )}

      {/* Strength Meter section (Register mode) */}
      {showStrengthMeter && value.length > 0 && (
        <div className="mt-1 space-y-2">
          {/* 4-segment bar & text label */}
          <div className="flex items-center gap-3">
            <div className="flex-1 grid grid-cols-4 gap-1.5 h-1.5">
              {[1, 2, 3, 4].map((seg) => (
                <div
                  key={seg}
                  className={`h-full rounded-full transition-colors ${
                    seg <= score ? barColorClass : "bg-[#232B3A]"
                  }`}
                />
              ))}
            </div>
            <span
              className={`text-xs font-semibold ${textColorClass} min-w-[50px] text-right`}
            >
              {strengthLabel}
            </span>
          </div>

          {/* Criteria Checklist */}
          <div className="space-y-1 pt-1">
            <div className="flex items-center gap-1.5 text-xs">
              {hasMinLength ? (
                <Check className="w-3.5 h-3.5 text-[#1FB878]" />
              ) : (
                <span className="w-3.5 h-3.5 text-[#5B6472] text-center inline-block">
                  •
                </span>
              )}
              <span
                className={hasMinLength ? "text-[#1FB878]" : "text-[#5B6472]"}
              >
                At least 8 characters
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              {hasNumber ? (
                <Check className="w-3.5 h-3.5 text-[#1FB878]" />
              ) : (
                <span className="w-3.5 h-3.5 text-[#5B6472] text-center inline-block">
                  •
                </span>
              )}
              <span
                className={hasNumber ? "text-[#1FB878]" : "text-[#5B6472]"}
              >
                One number
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              {hasSpecialChar ? (
                <Check className="w-3.5 h-3.5 text-[#1FB878]" />
              ) : (
                <span className="w-3.5 h-3.5 text-[#5B6472] text-center inline-block">
                  •
                </span>
              )}
              <span
                className={
                  hasSpecialChar ? "text-[#1FB878]" : "text-[#5B6472]"
                }
              >
                One special character
              </span>
            </div>
          </div>
        </div>
      )}

      {/* If strength meter is enabled and there's a standalone error, show error below */}
      {error && showStrengthMeter && (
        <span id={`${id}-error`} className="text-xs text-[#E5484D]">
          {error}
        </span>
      )}
    </div>
  );
}

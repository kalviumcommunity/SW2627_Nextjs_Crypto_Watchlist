// Enable Client Component rendering directive for stateful password toggle interactions
"use client";

// Import useState hook for tracking password text visibility (hidden vs visible)
import { useState } from "react";
// Import icons from Lucide React for password show/hide and checklist verification badges
import { Eye, EyeOff, Check, X } from "lucide-react";

// TypeScript interface defining component properties for PasswordInput
interface PasswordInputProps {
  // HTML id attribute for accessibility labeling
  id: string;
  // HTML name attribute for form serialization
  name?: string;
  // Current string value of password input
  value: string;
  // Event callback when input value changes
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // Event callback when input loses focus
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  // Input placeholder text
  placeholder?: string;
  // Optional validation error message string
  error?: string;
  // Label text displayed above input
  label?: string;
  // Optional right header node (e.g. 'Forgot Password?' link)
  headerRight?: React.ReactNode;
  // Boolean flag enabling strength meter indicator and criteria checklist
  showStrengthMeter?: boolean;
}

// Export default PasswordInput component
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
  // State storing boolean flag for showing password in plain text vs masked
  const [showPassword, setShowPassword] = useState(false);

  // Check password criteria 1: minimum length of 8 characters
  const hasMinLength = value.length >= 8;
  // Check password criteria 2: contains at least one numeric digit
  const hasNumber = /\d/.test(value);
  // Check password criteria 3: contains at least one special character
  const hasSpecialChar = /[^A-Za-z0-9]/.test(value);

  // Initialize numerical password strength score counter (0 to 4)
  let score = 0;
  if (value.length > 0) {
    if (value.length >= 6) score += 1;
    if (hasMinLength) score += 1;
    if (hasNumber) score += 1;
    if (hasSpecialChar) score += 1;
  }

  // Define default strength label and visual theme classes for 'Weak'
  let strengthLabel = "Weak";
  let barColorClass = "bg-[#E5484D]";
  let textColorClass = "text-[#E5484D]";

  // Apply visual styling and label for 'Strong' password score (≥4)
  if (score >= 4) {
    strengthLabel = "Strong";
    barColorClass = "bg-[#1FB878]";
    textColorClass = "text-[#1FB878]";
  // Apply visual styling and label for 'Medium' password score (2 or 3)
  } else if (score >= 2) {
    strengthLabel = "Medium";
    barColorClass = "bg-[#F5B94D]";
    textColorClass = "text-[#F5B94D]";
  }

  return (
    // Outer input wrapper container
    <div className="flex flex-col gap-1.5 w-full">
      {/* Input header row holding label and optional right link */}
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

      {/* Relative container holding input element and absolute toggle button */}
      <div className="relative w-full">
        {/* Controlled password input element with dynamic type attribute */}
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
              : "border-[#232B3A] focus:border-[#FF5446] focus:ring-1 focus:ring-[#FF5446]/30"
          }`}

        />

        {/* Toggle button switching password visibility between hidden and visible */}
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5B6472] hover:text-[#9AA4B2] transition-colors p-1 rounded cursor-pointer"
          title={showPassword ? "Hide password" : "Show password"}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {/* Render EyeOff icon when visible, render Eye icon when hidden */}
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Display validation error message when strength meter is not active */}
      {error && !showStrengthMeter && (
        <span id={`${id}-error`} className="text-xs text-[#E5484D]">
          {error}
        </span>
      )}

      {/* Conditionally render password strength meter and checklist when enabled */}
      {showStrengthMeter && value.length > 0 && (
        <div className="mt-1 space-y-2">
          {/* 4-segment visual strength bar and status label */}
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

          {/* Detailed requirement checklist displaying pass/fail indicators */}
          <div className="space-y-1 pt-1">
            {/* Rule 1: Minimum length check indicator */}
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

            {/* Rule 2: Numeric digit check indicator */}
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

            {/* Rule 3: Special character check indicator */}
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

      {/* Render validation error text below strength meter if present */}
      {error && showStrengthMeter && (
        <span id={`${id}-error`} className="text-xs text-[#E5484D]">
          {error}
        </span>
      )}
    </div>
  );
}


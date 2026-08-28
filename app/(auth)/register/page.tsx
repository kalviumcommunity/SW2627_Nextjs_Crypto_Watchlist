"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Check, X, Loader2 } from "lucide-react";

import PasswordInput from "@/components/auth/PasswordInput";
import OAuthButtons from "@/components/auth/OAuthButtons";
import InlineError from "@/components/auth/InlineError";
import { registerSchema } from "@/lib/validation/auth";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAgreed, setTermsAgreed] = useState(false);

  // Field errors
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [termsError, setTermsError] = useState("");
  const [serverError, setServerError] = useState("");

  // Async email check states
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState<boolean | null>(null);
  const [emailCheckMessage, setEmailCheckMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  // Debounced email check effect
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const trimmedEmail = email.trim();
    const isValidFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);

    if (!isValidFormat) {
      setIsCheckingEmail(false);
      setIsEmailAvailable(null);
      setEmailCheckMessage("");
      return;
    }

    setIsCheckingEmail(true);
    setIsEmailAvailable(null);
    setEmailCheckMessage("");

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/auth/check-email?email=${encodeURIComponent(trimmedEmail)}`
        );
        const data = await res.json();
        setIsCheckingEmail(false);

        if (data.available) {
          setIsEmailAvailable(true);
          setEmailCheckMessage("");
        } else {
          setIsEmailAvailable(false);
          setEmailCheckMessage("An account with this email already exists");
        }
      } catch (err) {
        setIsCheckingEmail(false);
        setIsEmailAvailable(null);
      }
    }, 500);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [email]);

  const handleConfirmPasswordBlur = () => {
    if (confirmPassword && confirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setTermsError("");

    if (!termsAgreed) {
      setTermsError("You must accept the terms of service");
      return;
    }

    if (isEmailAvailable === false) {
      setEmailError("An account with this email already exists");
      return;
    }

    // Client-side Zod validation
    const validation = registerSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
      terms: termsAgreed,
    });

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      if (fieldErrors.name?.[0]) setNameError(fieldErrors.name[0]);
      if (fieldErrors.email?.[0]) setEmailError(fieldErrors.email[0]);
      if (fieldErrors.password?.[0]) setPasswordError(fieldErrors.password[0]);
      if (fieldErrors.confirmPassword?.[0])
        setConfirmPasswordError(fieldErrors.confirmPassword[0]);
      if (fieldErrors.terms?.[0]) setTermsError(fieldErrors.terms[0]);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          confirmPassword,
          terms: termsAgreed,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || "Something went wrong. Please try again.");
        setIsLoading(false);
        return;
      }

      // Auto sign-in after registration
      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        router.push("/login");
      } else {
        router.push("/watchlist");
        router.refresh();
      }
    } catch (err) {
      setServerError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col space-y-6">
      {/* Header Block */}
      <div className="flex flex-col space-y-1">
        <h1 className="text-[24px] font-bold text-white tracking-tight">
          Create your account
        </h1>
        <p className="text-[14px] text-[#9AA4B2]">
          Start tracking the markets that matter to you.
        </p>
      </div>

      {/* Dismissible Error Banner */}
      {serverError && (
        <InlineError
          message={serverError}
          onDismiss={() => setServerError("")}
        />
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4" noValidate>
        {/* Full Name Field */}
        <div className="flex flex-col space-y-1.5">
          <label htmlFor="name" className="text-[13px] font-medium text-[#9AA4B2]">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError("");
            }}
            placeholder="Jane Doe"
            aria-invalid={!!nameError}
            aria-describedby={nameError ? "name-error" : undefined}
            className={`w-full h-[44px] px-4 bg-[#111827] text-white text-sm rounded-lg border transition-colors placeholder:text-[#5B6472] focus:outline-none ${
              nameError
                ? "border-[#E5484D] focus:border-[#E5484D]"
                : "border-[#232B3A] focus:border-[#3B82F6]"
            }`}
          />
          {nameError && (
            <span id="name-error" className="text-xs text-[#E5484D]">
              {nameError}
            </span>
          )}
        </div>

        {/* Email Field with Async Availability Indicator */}
        <div className="flex flex-col space-y-1.5">
          <label htmlFor="email" className="text-[13px] font-medium text-[#9AA4B2]">
            Email
          </label>
          <div className="relative w-full">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError("");
              }}
              placeholder="you@example.com"
              aria-invalid={!!emailError || isEmailAvailable === false}
              aria-describedby={
                emailError || emailCheckMessage ? "email-error" : undefined
              }
              className={`w-full h-[44px] px-4 pr-10 bg-[#111827] text-white text-sm rounded-lg border transition-colors placeholder:text-[#5B6472] focus:outline-none ${
                emailError || isEmailAvailable === false
                  ? "border-[#E5484D] focus:border-[#E5484D]"
                  : isEmailAvailable === true
                  ? "border-[#1FB878] focus:border-[#1FB878]"
                  : "border-[#232B3A] focus:border-[#3B82F6]"
              }`}
            />

            {/* Right-aligned inline indicator */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
              {isCheckingEmail && (
                <Loader2 className="w-4 h-4 text-[#5B6472] animate-spin" />
              )}
              {!isCheckingEmail && isEmailAvailable === true && (
                <Check className="w-4 h-4 text-[#1FB878]" />
              )}
              {!isCheckingEmail && isEmailAvailable === false && (
                <X className="w-4 h-4 text-[#E5484D]" />
              )}
            </div>
          </div>

          {(emailError || emailCheckMessage) && (
            <span id="email-error" className="text-xs text-[#E5484D]">
              {emailError || emailCheckMessage}
            </span>
          )}
        </div>

        {/* Password Field with Strength Meter */}
        <PasswordInput
          id="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (passwordError) setPasswordError("");
            if (confirmPasswordError && confirmPassword === e.target.value) {
              setConfirmPasswordError("");
            }
          }}
          error={passwordError}
          showStrengthMeter={true}
        />

        {/* Confirm Password Field */}
        <div className="flex flex-col space-y-1.5">
          <label
            htmlFor="confirmPassword"
            className="text-[13px] font-medium text-[#9AA4B2]"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (confirmPasswordError) setConfirmPasswordError("");
            }}
            onBlur={handleConfirmPasswordBlur}
            placeholder="••••••••"
            aria-invalid={!!confirmPasswordError}
            aria-describedby={
              confirmPasswordError ? "confirmPassword-error" : undefined
            }
            className={`w-full h-[44px] px-4 bg-[#111827] text-white text-sm rounded-lg border transition-colors placeholder:text-[#5B6472] focus:outline-none ${
              confirmPasswordError
                ? "border-[#E5484D] focus:border-[#E5484D]"
                : "border-[#232B3A] focus:border-[#3B82F6]"
            }`}
          />
          {confirmPasswordError && (
            <span id="confirmPassword-error" className="text-xs text-[#E5484D]">
              {confirmPasswordError}
            </span>
          )}
        </div>

        {/* Terms Checkbox */}
        <div className="flex flex-col space-y-1 pt-1">
          <div className="flex items-start gap-2.5">
            <button
              type="button"
              role="checkbox"
              aria-checked={termsAgreed}
              onClick={() => {
                setTermsAgreed(!termsAgreed);
                if (termsError) setTermsError("");
              }}
              className={`w-4 h-4 mt-0.5 rounded border flex items-center justify-center transition-colors cursor-pointer flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] ${
                termsAgreed
                  ? "bg-[#FF5446] border-[#FF5446]"
                  : "border-[#232B3A] bg-[#111827]"
              }`}
            >
              {termsAgreed && <Check className="w-3 h-3 text-white stroke-[3]" />}
            </button>
            <span
              onClick={() => {
                setTermsAgreed(!termsAgreed);
                if (termsError) setTermsError("");
              }}
              className="text-[13px] text-[#9AA4B2] leading-relaxed cursor-pointer select-none"
            >
              I agree to the{" "}
              <Link
                href="#"
                onClick={(e) => e.stopPropagation()}
                className="text-[#FF5446] hover:underline"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="#"
                onClick={(e) => e.stopPropagation()}
                className="text-[#FF5446] hover:underline"
              >
                Privacy Policy
              </Link>{" "}
              of CoinDCX
            </span>
          </div>
          {termsError && (
            <span className="text-xs text-[#E5484D] pl-6.5">{termsError}</span>
          )}
        </div>

        {/* Primary Submit Button (Disabled until terms agreed) */}
        <button
          type="submit"
          disabled={!termsAgreed || isLoading}
          aria-busy={isLoading}
          className="w-full h-[44px] bg-[#FF5446] hover:bg-[#D63A2F] text-white font-bold text-sm rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#3B82F6] mt-2"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-white" />
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative flex items-center justify-center my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#232B3A]" />
        </div>
        <div className="relative px-3 bg-[#050810] text-[12px] font-medium text-[#5B6472]">
          OR
        </div>
      </div>

      {/* OAuth Buttons */}
      <OAuthButtons />

      {/* Footer */}
      <div className="text-center pt-2 text-[14px] text-[#9AA4B2]">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-[#FF5446] font-semibold hover:underline"
        >
          Log in
        </Link>
      </div>
    </div>
  );
}

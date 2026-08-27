"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Check, Loader2 } from "lucide-react";

import PasswordInput from "@/components/auth/PasswordInput";
import OAuthButtons from "@/components/auth/OAuthButtons";
import InlineError from "@/components/auth/InlineError";
import { loginSchema } from "@/lib/validation/auth";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [authError, setAuthError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setEmailError("");
    setPasswordError("");

    // Client-side Zod validation
    const validation = loginSchema.safeParse({ email, password, rememberMe });
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      if (fieldErrors.email?.[0]) setEmailError(fieldErrors.email[0]);
      if (fieldErrors.password?.[0]) setPasswordError(fieldErrors.password[0]);
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setAuthError("Invalid email or password. Please try again.");
        setIsLoading(false);
      } else {
        router.push("/watchlist");
        router.refresh();
      }
    } catch (err) {
      setAuthError("Invalid email or password. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col space-y-6">
      {/* Header Block */}
      <div className="flex flex-col space-y-1">
        <h1 className="text-[24px] font-bold text-white tracking-tight">
          Welcome back
        </h1>
        <p className="text-[14px] text-[#9AA4B2]">
          Log in to your CoinDCX account
        </p>
      </div>

      {/* Dismissible Error Banner */}
      {authError && (
        <InlineError
          message={authError}
          onDismiss={() => setAuthError("")}
        />
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4" noValidate>
        {/* Email Field */}
        <div className="flex flex-col space-y-1.5">
          <label htmlFor="email" className="text-[13px] font-medium text-[#9AA4B2]">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError("");
            }}
            placeholder="you@example.com"
            aria-invalid={!!emailError}
            aria-describedby={emailError ? "email-error" : undefined}
            className={`w-full h-[44px] px-4 bg-[#111827] text-white text-sm rounded-lg border transition-colors placeholder:text-[#5B6472] focus:outline-none ${
              emailError
                ? "border-[#E5484D] focus:border-[#E5484D]"
                : "border-[#232B3A] focus:border-[#3B82F6]"
            }`}
          />
          {emailError && (
            <span id="email-error" className="text-xs text-[#E5484D]">
              {emailError}
            </span>
          )}
        </div>

        {/* Password Field */}
        <PasswordInput
          id="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (passwordError) setPasswordError("");
          }}
          error={passwordError}
          headerRight={
            <Link
              href="#"
              className="text-[13px] text-[#9AA4B2] hover:text-[#FF5446] transition-colors"
            >
              Forgot password?
            </Link>
          }
        />

        {/* Remember Me Checkbox */}
        <div className="flex items-center gap-2.5 pt-1">
          <button
            type="button"
            role="checkbox"
            aria-checked={rememberMe}
            onClick={() => setRememberMe(!rememberMe)}
            className={`w-4 h-4 rounded border flex items-center justify-center transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#3B82F6] ${
              rememberMe
                ? "bg-[#FF5446] border-[#FF5446]"
                : "border-[#232B3A] bg-[#111827]"
            }`}
          >
            {rememberMe && <Check className="w-3 h-3 text-white stroke-[3]" />}
          </button>
          <span
            onClick={() => setRememberMe(!rememberMe)}
            className="text-[13px] text-[#9AA4B2] cursor-pointer select-none"
          >
            Remember me
          </span>
        </div>

        {/* Primary Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          aria-busy={isLoading}
          className="w-full h-[44px] bg-[#FF5446] hover:bg-[#D63A2F] text-white font-bold text-sm rounded-lg transition-colors flex items-center justify-center disabled:opacity-60 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#3B82F6] mt-2"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-white" />
          ) : (
            "Log In"
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
        Don't have an account?{" "}
        <Link
          href="/register"
          className="text-[#FF5446] font-semibold hover:underline"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}

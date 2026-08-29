// Directive enabling Client Component functionality for interactive state and events
"use client";

// Import NextAuth signIn trigger function for social OAuth authentication
import { signIn } from "next-auth/react";
// Import React useState hook for controlling loading and error state
import { useState } from "react";
// Import InlineError banner component for displaying OAuth setup error alerts
import InlineError from "@/components/auth/InlineError";

// Export default functional component rendering Google and GitHub OAuth login buttons
export default function OAuthButtons() {
  // Local state tracking which provider is currently undergoing sign-in loading ("google" | "github" | null)
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  // Local state storing error message string if OAuth sign-in fails or is unconfigured
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Handler function executing OAuth provider login flow
  const handleOAuthLogin = async (provider: "google" | "github") => {
    // Clear any existing error messages before initiating new login attempt
    setErrorMessage("");
    try {
      // Set active loading provider to display loader text and disable buttons
      setLoadingProvider(provider);
      // Trigger NextAuth signIn method for the requested provider without immediate redirect
      const res = await signIn(provider, { callbackUrl: "/watchlist", redirect: false });
      // Check if sign-in response returned an error (e.g., missing provider credentials)
      if (res && "error" in res && res.error) {
        setErrorMessage(
          `${provider === "google" ? "Google" : "GitHub"} OAuth is not configured. Please set ${provider.toUpperCase()}_CLIENT_ID and ${provider.toUpperCase()}_CLIENT_SECRET in .env.local`
        );
      }
    } catch (err: any) {
      // Catch exceptions during OAuth execution and set user-friendly error message
      setErrorMessage(
        `${provider === "google" ? "Google" : "GitHub"} OAuth credentials are missing. Please set up .env.local`
      );
    } finally {
      // Reset loading provider state regardless of outcome
      setLoadingProvider(null);
    }
  };

  return (
    // Outer flex layout container holding error banner and OAuth buttons
    <div className="flex flex-col gap-3 w-full">
      {/* Conditionally render error banner if OAuth error message is set */}
      {errorMessage && (
        <InlineError
          message={errorMessage}
          onDismiss={() => setErrorMessage("")}
        />
      )}

      {/* Google OAuth login button */}
      <button
        type="button"
        onClick={() => handleOAuthLogin("google")}
        disabled={!!loadingProvider}
        className="w-full h-[44px] bg-[#111827] border border-[#232B3A] hover:border-[#374151] rounded-lg flex items-center justify-center gap-3 text-sm font-semibold text-[#F5F6F8] hover:bg-[#1B2536] transition-all focus:outline-none focus:ring-1 focus:ring-[#FF5446]/40 disabled:opacity-50 cursor-pointer shadow-xs active:scale-[0.99]"
      >
        {/* Colorful Google 'G' brand SVG logo */}
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#EA4335"
            d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
          />
          <path
            fill="#4285F4"
            d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
          />
          <path
            fill="#FBBC05"
            d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9c-.6-1.5-.9-3.2-.9-5z"
          />
          <path
            fill="#34A853"
            d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
          />
        </svg>
        {/* Dynamic button label toggling between 'Connecting...' and 'Continue with Google' */}
        <span>
          {loadingProvider === "google"
            ? "Connecting..."
            : "Continue with Google"}
        </span>
      </button>

      {/* GitHub OAuth login button */}
      <button
        type="button"
        onClick={() => handleOAuthLogin("github")}
        disabled={!!loadingProvider}
        className="w-full h-[44px] bg-[#111827] border border-[#232B3A] hover:border-[#374151] rounded-lg flex items-center justify-center gap-3 text-sm font-semibold text-[#F5F6F8] hover:bg-[#1B2536] transition-all focus:outline-none focus:ring-1 focus:ring-[#FF5446]/40 disabled:opacity-50 cursor-pointer shadow-xs active:scale-[0.99]"
      >

        {/* GitHub Octocat brand SVG logo */}
        <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
        {/* Dynamic button label toggling between 'Connecting...' and 'Continue with GitHub' */}
        <span>
          {loadingProvider === "github"
            ? "Connecting..."
            : "Continue with GitHub"}
        </span>
      </button>
    </div>
  );
}


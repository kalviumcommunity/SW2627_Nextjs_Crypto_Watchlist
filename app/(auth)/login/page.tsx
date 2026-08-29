// Enable Client Component rendering directive for interactive React hooks in Next.js App Router
"use client";

// Import React hook for local component state management
import { useState } from "react";
// Import Link component for client-side routing
import Link from "next/link";
// Import useRouter hook for programmatic page navigation after login
import { useRouter } from "next/navigation";
// Import signIn function from NextAuth client SDK for credentials authentication
import { signIn } from "next-auth/react";
// Import icons from Lucide React for checkbox state and loading spinner
import { Check, Loader2 } from "lucide-react";

// Import custom reusable password input component with visibility toggle
import PasswordInput from "@/components/auth/PasswordInput";
// Import social OAuth login buttons component (Google / GitHub)
import OAuthButtons from "@/components/auth/OAuthButtons";
// Import banner notification component for authentication errors
import InlineError from "@/components/auth/InlineError";
// Import Zod schema for client-side form field validation
import { loginSchema } from "@/lib/validation/auth";

// Define and export the default page component for the Login route
export default function LoginPage() {
  // Initialize router instance to perform navigation redirects
  const routerInstance = useRouter();

  // Controlled form state for user email address input
  const [email, setEmail] = useState("");
  // Controlled form state for user password input
  const [password, setPassword] = useState("");
  // Controlled checkbox state for persistence preference
  const [rememberMe, setRememberMe] = useState(false);

  // Error message state specifically for email validation error
  const [emailError, setEmailError] = useState("");
  // Error message state specifically for password validation error
  const [passwordError, setPasswordError] = useState("");
  // General top-level authentication error (e.g. invalid credentials)
  const [authError, setAuthError] = useState("");

  // Loading state flag indicating authentication request is in progress
  const [isLoading, setIsLoading] = useState(false);

  // Form submission handler function executed on form submit
  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent browser default full-page reload on form submission
    e.preventDefault();
    // Clear previous error messages before validating current submission
    setAuthError("");
    setEmailError("");
    setPasswordError("");

    // Execute client-side validation against Zod schema
    const validation = loginSchema.safeParse({ email, password, rememberMe });
    // If validation fails, extract and display field-specific error messages
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      if (fieldErrors.email?.[0]) setEmailError(fieldErrors.email[0]);
      if (fieldErrors.password?.[0]) setPasswordError(fieldErrors.password[0]);
      return;
    }

    // Set loading indicator state to true to show spinner and disable submit button
    setIsLoading(true);

    try {
      // Call NextAuth signIn method with 'credentials' provider and input credentials
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      // Handle authentication error response from NextAuth
      if (result?.error) {
        setAuthError("Invalid email or password. Please try again.");
        setIsLoading(false);
      } else {
        // Navigate user to their watchlist page upon successful login
        routerInstance.push("/watchlist");
        // Refresh router context to update authentication session state
        routerInstance.refresh();
      }
    } catch (err) {
      // Catch unexpected network/runtime exceptions during sign-in
      setAuthError("Invalid email or password. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    // Outer flex wrapper containing login header, form, dividers, and footer links
    <div className="w-full flex flex-col space-y-6">
      {/* Header section with heading and subtitle */}
      <div className="flex flex-col space-y-1">
        {/* Main page title */}
        <h1 className="text-[24px] font-bold text-white tracking-tight">
          Welcome back
        </h1>
        {/* Subheading prompt */}
        <p className="text-[14px] text-[#9AA4B2]">
          Log in to your CoinDCX account
        </p>
      </div>

      {/* Conditionally render error banner if authError string is non-empty */}
      {authError && (
        <InlineError
          message={authError}
          onDismiss={() => setAuthError("")}
        />
      )}

      {/* Main credentials login form */}
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4" noValidate>
        {/* Email input field group */}
        <div className="flex flex-col space-y-1.5">
          {/* Label for email input */}
          <label htmlFor="email" className="text-[13px] font-medium text-[#9AA4B2]">
            Email
          </label>
          {/* Controlled text input for email address */}
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
                : "border-[#232B3A] focus:border-[#FF5446] focus:ring-1 focus:ring-[#FF5446]/30"
            }`}
          />
          {/* Render inline error message text if email validation error exists */}
          {emailError && (
            <span id="email-error" className="text-xs text-[#E5484D]">
              {emailError}
            </span>
          )}
        </div>

        {/* Custom Password Input component with toggle and forgot password link */}
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

        {/* Checkbox option for saving login session */}
        <div className="flex items-center gap-2.5 pt-1">
          {/* Custom checkbox button element */}
          <button
            type="button"
            role="checkbox"
            aria-checked={rememberMe}
            onClick={() => setRememberMe(!rememberMe)}
            className={`w-4 h-4 rounded border flex items-center justify-center transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#FF5446]/40 ${
              rememberMe
                ? "bg-[#FF5446] border-[#FF5446]"
                : "border-[#232B3A] bg-[#111827]"
            }`}
          >
            {/* Render checkmark icon inside checkbox when checked */}
            {rememberMe && <Check className="w-3 h-3 text-white stroke-[3]" />}
          </button>
          {/* Clickable text label toggling the remember me checkbox state */}
          <span
            onClick={() => setRememberMe(!rememberMe)}
            className="text-[13px] text-[#9AA4B2] cursor-pointer select-none"
          >
            Remember me
          </span>
        </div>

        {/* Primary submit action button */}
        <button
          type="submit"
          disabled={isLoading}
          aria-busy={isLoading}
          className="w-full h-[44px] bg-[#FF5446] hover:bg-[#D63A2F] active:scale-[0.99] text-white font-bold text-sm rounded-lg transition-all flex items-center justify-center disabled:opacity-60 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF5446]/40 shadow-sm mt-2"
        >
          {/* Render spinner icon during loading state, otherwise display 'Log In' text */}
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-white" />
          ) : (
            "Log In"
          )}
        </button>

      </form>

      {/* Visual divider line with 'OR' label separating credentials login and OAuth options */}
      <div className="relative flex items-center justify-center my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#232B3A]" />
        </div>
        <div className="relative px-3 bg-[#050810] text-[12px] font-medium text-[#5B6472]">
          OR
        </div>
      </div>

      {/* Social authentication buttons (Google, GitHub) */}
      <OAuthButtons />

      {/* Footer navigation link directing unregistered users to registration page */}
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


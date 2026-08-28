// Import AlertCircle (error indicator icon) and X (close icon) from Lucide React
import { AlertCircle, X } from "lucide-react";

// TypeScript interface defining component props for InlineError
interface InlineErrorProps {
  // Required string containing the error message to display
  message: string;
  // Optional callback handler invoked when the dismiss button is clicked
  onDismiss?: () => void;
}

// Export default functional component for rendering inline alert error banners
export default function InlineError({ message, onDismiss }: InlineErrorProps) {
  // Return null (render nothing) if error message is empty or undefined
  if (!message) return null;

  return (
    // Container element with accessible alert role, red background tint, red border, and flex spacing
    <div
      role="alert"
      className="flex items-start justify-between gap-3 p-3 bg-[#3A1B22] border border-[#E5484D]/40 text-[#E5484D] text-xs md:text-sm rounded-lg transition-all"
    >
      {/* Left section containing alert icon and message text */}
      <div className="flex items-start gap-2.5">
        {/* Red error alert icon */}
        <AlertCircle className="w-4 h-4 text-[#E5484D] flex-shrink-0 mt-0.5" />
        {/* Error message string text */}
        <span className="font-medium leading-relaxed">{message}</span>
      </div>
      {/* Render dismiss button conditionally if onDismiss prop function is provided */}
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-[#E5484D] opacity-70 hover:opacity-100 p-0.5 rounded transition-opacity"
          aria-label="Dismiss error"
        >
          {/* Close X icon inside dismiss button */}
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}


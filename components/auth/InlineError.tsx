import { AlertCircle, X } from "lucide-react";

interface InlineErrorProps {
  message: string;
  onDismiss?: () => void;
}

export default function InlineError({ message, onDismiss }: InlineErrorProps) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="flex items-start justify-between gap-3 p-3 bg-[#3A1B22] border border-[#E5484D]/40 text-[#E5484D] text-xs md:text-sm rounded-lg transition-all"
    >
      <div className="flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-[#E5484D] flex-shrink-0 mt-0.5" />
        <span className="font-medium leading-relaxed">{message}</span>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-[#E5484D] opacity-70 hover:opacity-100 p-0.5 rounded transition-opacity"
          aria-label="Dismiss error"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

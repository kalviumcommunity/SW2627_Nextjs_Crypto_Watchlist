"use client";
 
import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import EmptyState from "@/components/states/EmptyState";
 
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);
 
  return (
    <main className="max-w-[1280px] w-full mx-auto px-4 md:px-6 py-12 md:py-16 flex-1 flex flex-col items-center justify-center">
      <EmptyState
        icon={AlertCircle}
        iconClassName="text-[#E5484D]"
        iconTileClassName="bg-[#3A1B22] border-[#E5484D]/30 shadow-[0_0_24px_rgba(229,72,77,0.15)]"
        title="Something went wrong"
        description="We encountered an error while loading market data. You can try again or return to the main markets page."
        action={{
          label: "Try Again",
          onClick: reset,
          icon: RefreshCw,
          variant: "primary",
        }}
        secondaryAction={{
          label: "Explore all Coins",
          href: "/markets",
          variant: "secondary",
        }}
        minHeight="min-h-[380px]"
      />
    </main>
  );
}

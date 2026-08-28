import Link from "next/link";
import { Check } from "lucide-react";

export default function AuthLeftPanel() {
  return (
    <div className="hidden lg:flex lg:w-[55%] bg-[#10131C] relative overflow-hidden flex-col justify-center items-center p-12 select-none border-r border-[#232B3A]">
      {/* Background decoration: Green arcing chart line motif at ~8% opacity */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.08]"
        viewBox="0 0 600 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="chartGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1FB878" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#1FB878" stopOpacity="1" />
          </linearGradient>
        </defs>
        <path
          d="M -50 650 Q 150 550, 250 420 T 450 220 T 650 80"
          stroke="url(#chartGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M -50 650 Q 150 550, 250 420 T 450 220 T 650 80 L 650 800 L -50 800 Z"
          fill="url(#chartGradient)"
          opacity="0.15"
        />
      </svg>

      {/* Content Box */}
      <div className="relative z-10 max-w-[440px] w-full flex flex-col items-start text-left space-y-6">
        {/* Logo Lockup (Large) */}
        <Link href="/markets" className="flex items-center flex-shrink-0 mb-2">
          <span className="text-[32px] leading-none font-bold tracking-tight">
            <span className="text-white">Coin</span>
            <span className="text-[#FF5446]">DCX</span>
          </span>
        </Link>

        {/* Headline */}
        <h2 className="text-[28px] leading-[36px] font-bold text-white tracking-tight">
          Track every market. Never miss a move.
        </h2>

        {/* Supporting Copy */}
        <p className="text-[15px] leading-[24px] text-[#9AA4B2]">
          Real-time prices, custom watchlists, and portfolio tracking — all in one dashboard.
        </p>

        {/* Feature Bullets */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-[#1FB878]/10 flex items-center justify-center flex-shrink-0">
              <Check className="w-3.5 h-3.5 text-[#1FB878]" />
            </div>
            <span className="text-sm font-medium text-[#F5F6F8]">
              Live price alerts
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-[#1FB878]/10 flex items-center justify-center flex-shrink-0">
              <Check className="w-3.5 h-3.5 text-[#1FB878]" />
            </div>
            <span className="text-sm font-medium text-[#F5F6F8]">
              Unlimited watchlists
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-[#1FB878]/10 flex items-center justify-center flex-shrink-0">
              <Check className="w-3.5 h-3.5 text-[#1FB878]" />
            </div>
            <span className="text-sm font-medium text-[#F5F6F8]">
              Institutional-grade market data
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

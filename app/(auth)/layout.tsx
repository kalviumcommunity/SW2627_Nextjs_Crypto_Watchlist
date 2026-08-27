import AuthLeftPanel from "@/components/auth/AuthLeftPanel";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#050810] text-[#F5F6F8] flex flex-col lg:flex-row">
      {/* Left Panel: Split screen hero section (Desktop ≥1024px) */}
      <AuthLeftPanel />

      {/* Right Panel: Form container */}
      <main className="flex-1 bg-[#050810] flex flex-col justify-center items-center px-4 py-12 lg:px-8 w-full min-h-screen">
        {/* Mobile Top Logo Lockup (<1024px) */}
        <div className="lg:hidden mb-8 flex justify-center">
          <Link href="/markets" className="flex items-center">
            <span className="text-2xl font-bold tracking-tight">
              <span className="text-white">Coin</span>
              <span className="text-[#FF5446]">DCX</span>
            </span>
          </Link>
        </div>

        {/* Centered Form Shell (max-width 400px) */}
        <div className="w-full max-w-[400px] flex flex-col">{children}</div>
      </main>
    </div>
  );
}

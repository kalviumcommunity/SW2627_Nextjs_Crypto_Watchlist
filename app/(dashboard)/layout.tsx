import { Suspense } from "react";
import NavBar from "@/components/NavBar";
import Providers from "@/components/Providers";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className="min-h-screen bg-[#050810] text-[#F5F6F8] flex flex-col">
        <Suspense fallback={<header className="h-[56px] bg-[#10131C] border-b border-[#232B3A]" />}>
          <NavBar />
        </Suspense>
        <div className="flex-1">{children}</div>
      </div>
    </Providers>
  );
}


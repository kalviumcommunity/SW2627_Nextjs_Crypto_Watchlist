import { Suspense } from "react";
import { redirect } from "next/navigation";
import NavBar from "@/components/NavBar";
import Providers from "@/components/Providers";
import { auth } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <Providers session={session}>
      <div className="min-h-screen bg-[#050810] text-[#F5F6F8] flex flex-col">
        <Suspense fallback={<header className="h-[56px] bg-[#10131C] border-b border-[#232B3A]" />}>
          <NavBar />
        </Suspense>
        <div className="flex-1">{children}</div>
      </div>
    </Providers>
  );
}


// Import the branding hero left sidebar component used on desktop viewports
import AuthLeftPanel from "@/components/auth/AuthLeftPanel";
// Import Link component from Next.js for client-side navigation back to markets page
import Link from "next/link";

// Define the root layout component for authentication pages (Login and Register)
export default function AuthLayout({
  // Destructure children prop representing the active page component (login or register)
  children,
}: {
  // TypeScript type annotation specifying that children must be valid React renderable nodes
  children: React.ReactNode;
}) {
  return (
    // Outer layout wrapper container: full viewport height, dark background, column layout on mobile, side-by-side on desktop (lg:flex-row)
    <div className="min-h-screen bg-[#050810] text-[#F5F6F8] flex flex-col lg:flex-row">
      {/* Render the left hero panel containing branding, features, and testimonials (visible on desktop ≥1024px) */}
      <AuthLeftPanel />

      {/* Main right panel container holding the form content, centered vertically and horizontally */}
      <main className="flex-1 bg-[#050810] flex flex-col justify-center items-center px-4 py-12 lg:px-8 w-full min-h-screen">
        {/* Render mobile-only brand logo header at top of form when left panel is hidden (<1024px) */}
        <div className="lg:hidden mb-8 flex justify-center">
          {/* Clickable brand logo linking back to the main markets overview dashboard */}
          <Link href="/markets" className="flex items-center">
            {/* Styled logo text split into 'Coin' (white) and 'DCX' (accent red) */}
            <span className="text-2xl font-bold tracking-tight">
              <span className="text-white">Coin</span>
              <span className="text-[#FF5446]">DCX</span>
            </span>
          </Link>
        </div>

        {/* Central form card shell restricting max width to 400px for optimal form readability */}
        <div className="w-full max-w-[400px] flex flex-col">{children}</div>
      </main>
    </div>
  );
}


import { Globe, FileText } from "lucide-react";

interface AboutCardProps {
  name: string;
  symbol: string;
  description?: string | null;
  websiteUrl?: string | null;
  whitepaperUrl?: string | null;
}

export default function AboutCard({
  name,
  symbol,
  description,
  websiteUrl,
  whitepaperUrl,
}: AboutCardProps) {
  const fallbackDescription = `${name} is a decentralized digital asset built on advanced blockchain technology.`;
  const text = description || fallbackDescription;
  const paragraphs = text.split("\n\n").filter(Boolean);

  const website = websiteUrl || `https://${name.toLowerCase().replace(/\s+/g, "")}.org`;
  const whitepaper = whitepaperUrl || `https://${name.toLowerCase().replace(/\s+/g, "")}.org/whitepaper`;

  return (
    <div className="bg-[#111827] border border-[#232B3A] rounded-[10px] p-5 md:p-6 w-full mt-6">
      <h2 className="text-[15px] font-bold text-white pb-3 border-b border-[#232B3A] mb-4">
        About {name} ({symbol})
      </h2>

      <div className="space-y-4 text-sm text-[#9AA4B2] leading-relaxed mb-6">
        {paragraphs.map((p, idx) => (
          <p key={idx}>{p}</p>
        ))}
      </div>

      {/* Footer Links Row */}
      <div className="flex items-center gap-3 pt-2 text-xs md:text-sm font-medium">
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[#9AA4B2] hover:text-white transition-colors"
        >
          <Globe className="w-4 h-4 text-[#FF5446]" />
          <span>Official Website</span>
        </a>

        <span className="w-[1px] h-4 bg-[#232B3A]" />

        <a
          href={whitepaper}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[#9AA4B2] hover:text-white transition-colors"
        >
          <FileText className="w-4 h-4 text-[#FF5446]" />
          <span>Whitepaper</span>
        </a>
      </div>
    </div>
  );
}

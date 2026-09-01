import { Globe, FileText, ExternalLink } from "lucide-react";

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
    <div className="bg-[#111827] border border-[#232B3A] hover:border-[#374151] transition-colors rounded-[10px] p-5 md:p-6 w-full mt-6 shadow-sm">
      <h2 className="text-[15px] font-bold text-white pb-3 border-b border-[#232B3A] mb-4">
        About {name} ({symbol})
      </h2>

      <div className="space-y-4 text-sm text-[#9AA4B2] leading-relaxed mb-6">
        {paragraphs.map((p, idx) => (
          <p key={idx}>{p}</p>
        ))}
      </div>

      {/* Footer Links Row */}
      <div className="flex flex-wrap items-center gap-3 pt-2 text-xs md:text-sm font-medium">
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#10131C] border border-[#232B3A] text-[#9AA4B2] hover:text-white hover:border-[#374151] transition-all group"
        >
          <Globe className="w-4 h-4 text-[#FF5446]" />
          <span>Official Website</span>
          <ExternalLink className="w-3 h-3 text-[#5B6472] group-hover:text-white transition-colors" />
        </a>

        <a
          href={whitepaper}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#10131C] border border-[#232B3A] text-[#9AA4B2] hover:text-white hover:border-[#374151] transition-all group"
        >
          <FileText className="w-4 h-4 text-[#FF5446]" />
          <span>Whitepaper</span>
          <ExternalLink className="w-3 h-3 text-[#5B6472] group-hover:text-white transition-colors" />
        </a>
      </div>
    </div>
  );
}


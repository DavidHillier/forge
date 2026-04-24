import { Flame } from "lucide-react";

export function Crest({ compact = false }: { compact?: boolean }) {
  return (
    <div className="inline-grid place-items-center rounded-md border border-[#C9A24D]/55 bg-[#073B29] text-[#C9A24D]" style={{ width: compact ? 36 : 48, height: compact ? 36 : 48 }}>
      <Flame size={compact ? 18 : 24} strokeWidth={1.8} />
    </div>
  );
}

"use client";

import { useState } from "react";
import { ArrowLeft, X } from "lucide-react";
import {
  getRecommendedSubstitutes,
  getSubstitutionDisplayLabel,
} from "@/lib/substitutions/logic";
import type { SubstituteOption, SubstitutionReason } from "@/lib/substitutions/types";

const REASONS: SubstitutionReason[] = [
  "closest_match",
  "easier",
  "harder",
  "no_equipment",
  "joint_friendly",
  "bodyweight",
  "heavier_strength",
  "conditioning",
];

const REASON_DESCRIPTIONS: Record<SubstitutionReason, string> = {
  closest_match: "Same movement, different tool",
  easier: "Reduce difficulty today",
  harder: "Challenge yourself more",
  no_equipment: "No kit needed",
  joint_friendly: "Lower stress on joints",
  bodyweight: "Bodyweight exercises only",
  heavier_strength: "Heavier load, more strength",
  conditioning: "Keep heart rate up",
  equipment_unavailable: "Missing specific equipment",
};

type Props = {
  exerciseDisplayName: string;
  substitutes: SubstituteOption[];
  userEquipment: string[];
  onSelect: (sub: SubstituteOption, reason: SubstitutionReason) => void;
  onClose: () => void;
};

export function SubstituteSheet({ exerciseDisplayName, substitutes, userEquipment, onSelect, onClose }: Props) {
  const [reason, setReason] = useState<SubstitutionReason | null>(null);

  const ranked = reason
    ? getRecommendedSubstitutes(substitutes, reason, userEquipment.length > 0 ? userEquipment : undefined)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-md rounded-t-2xl sm:rounded-2xl bg-[#FBF8F1] text-[#10251D] max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E4DCCB]">
          <div className="flex items-center gap-3">
            {reason && (
              <button onClick={() => setReason(null)} className="text-[#6B756F]">
                <ArrowLeft size={18} />
              </button>
            )}
            <div>
              <p className="text-xs text-[#6B756F] uppercase tracking-wide">Swap exercise</p>
              <h2 className="font-[var(--font-display)] text-xl font-semibold">{exerciseDisplayName}</h2>
            </div>
          </div>
          <button onClick={onClose} className="text-[#6B756F]"><X size={18} /></button>
        </div>

        <div className="overflow-y-auto flex-1 p-5">
          {!reason ? (
            /* Step 1 — reason selection */
            <div className="grid gap-2">
              <p className="text-sm text-[#6B756F] mb-1">Why do you want to swap?</p>
              {REASONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setReason(r)}
                  className="flex items-start justify-between rounded-xl border border-[#E4DCCB] bg-white p-4 text-left hover:border-[#1B3D2F] transition-colors"
                >
                  <div>
                    <p className="font-semibold text-sm">{getSubstitutionDisplayLabel(r)}</p>
                    <p className="text-xs text-[#6B756F] mt-0.5">{REASON_DESCRIPTIONS[r]}</p>
                  </div>
                  <span className="text-[#C9A84C] mt-0.5">›</span>
                </button>
              ))}
            </div>
          ) : ranked.length === 0 ? (
            <p className="text-sm text-[#6B756F] text-center py-8">No substitutes found for this reason.</p>
          ) : (
            /* Step 2 — substitute cards */
            <div className="grid gap-3">
              <p className="text-sm text-[#6B756F] mb-1">Select a substitute</p>
              {ranked.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => onSelect(sub, reason)}
                  className="rounded-xl border border-[#E4DCCB] bg-white p-4 text-left hover:border-[#1B3D2F] transition-colors w-full"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{sub.substitute.name}</p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        <span className="text-xs bg-[#F7F3EA] rounded px-2 py-0.5">{sub.substitute.difficulty}</span>
                        <span className="text-xs bg-[#F7F3EA] rounded px-2 py-0.5">{sub.substitute.equipment.join(", ")}</span>
                        <span className="text-xs bg-[#F7F3EA] rounded px-2 py-0.5 capitalize">{sub.matchQuality} match</span>
                        {sub.isAdvanced && <span className="text-xs bg-[#C9A84C]/20 text-[#7A5C1A] rounded px-2 py-0.5">Advanced</span>}
                      </div>
                      {sub.scalingNote && <p className="text-xs text-[#6B756F] mt-1.5">{sub.scalingNote}</p>}
                      {sub.cautionNote && <p className="text-xs text-[#B94A48] mt-1">{sub.cautionNote}</p>}
                    </div>
                    <span className="text-[#C9A84C] shrink-0">›</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

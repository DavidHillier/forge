"use client";

import { useState } from "react";
import { CheckCircle2, Footprints, Plus } from "lucide-react";
import { logWalkAction } from "@/lib/actions/app-actions";

export function LogWalkButton({
  targetKm,
  weeklyTotalKm,
}: {
  targetKm: number;
  weeklyTotalKm: number;
}) {
  const [open, setOpen] = useState(false);
  const [km, setKm] = useState("1");

  const remaining = Math.max(0, targetKm - weeklyTotalKm);
  const pct = Math.min(100, Math.round((weeklyTotalKm / targetKm) * 100));
  const done = weeklyTotalKm >= targetKm;

  return (
    <div className={`rounded-lg border p-4 ${done ? "border-[#0F4A32]/20 bg-[#0F4A32]/5" : "border-[#E4DCCB] bg-white"}`}>
      {/* Header row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Footprints className={`shrink-0 ${done ? "text-[#0F4A32]" : "text-[#B9903D]"}`} size={20} />
          <div>
            <p className="font-semibold text-[#10251D]">
              Weekly walk target
              {done && <span className="ml-2 text-xs font-normal text-[#0F4A32]">✓ target met</span>}
            </p>
            <p className="text-xs text-[#6B756F]">
              {weeklyTotalKm.toFixed(1)} / {targetKm} km this week
              {remaining > 0 && ` · ${remaining.toFixed(1)} km to go`}
            </p>
          </div>
        </div>
        {!done && (
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-1 rounded-full bg-[#0F4A32] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#0a3a24]"
          >
            <Plus size={13} /> Log walk
          </button>
        )}
        {done && <CheckCircle2 className="shrink-0 text-[#0F4A32]" size={20} />}
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-2 rounded-full bg-[#E4DCCB]">
        <div
          className={`h-2 rounded-full transition-all ${done ? "bg-[#0F4A32]" : "bg-[#B9903D]"}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Inline log form */}
      {open && !done && (
        <form
          action={logWalkAction}
          onSubmit={() => setOpen(false)}
          className="mt-4 flex items-end gap-3 border-t border-[#E4DCCB] pt-4"
        >
          <div className="flex-1">
            <label className="mb-1 block text-xs font-semibold text-[#6B756F]">
              Distance (km)
            </label>
            <input
              type="number"
              name="distanceKm"
              step="0.1"
              min="0.1"
              value={km}
              onChange={(e) => setKm(e.target.value)}
              className="w-full rounded-md border border-[#D9D0BE] bg-[#F7F3EA] px-3 py-2 text-sm tabular-nums focus:border-[#0F4A32] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-[#0F4A32] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0a3a24]"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-md border border-[#E4DCCB] px-4 py-2 text-sm text-[#6B756F] transition hover:bg-[#F7F3EA]"
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { inputClass } from "@/components/ui/field";
import { completeWorkoutAction } from "@/lib/actions/app-actions";
import { loadSubstitutions, loadWeights } from "@/lib/substitutions/logic";
import type { WorkoutSubstitutionEntry } from "@/lib/substitutions/types";

type Props = {
  workoutId: string;
  totalSeconds: number;
  circuitsCompleted: number;
  roundsCompleted: number;
  hadFailures: boolean;
};

export function WorkoutCompleteForm({ workoutId, totalSeconds, circuitsCompleted, roundsCompleted, hadFailures }: Props) {
  const [subs] = useState<WorkoutSubstitutionEntry[]>(() => loadSubstitutions(workoutId));
  const [weightsJson] = useState(() => {
    const w = loadWeights(workoutId);
    const entries = Object.entries(w)
      .filter(([, weight]) => weight > 0)
      .map(([exerciseName, weight]) => ({ exerciseName, weight }));
    return JSON.stringify(entries);
  });

  return (
    <form action={completeWorkoutAction} className="grid gap-4">
      <input type="hidden" name="workoutId" value={workoutId} />
      <input type="hidden" name="totalSeconds" value={totalSeconds} />
      <input type="hidden" name="circuitsCompleted" value={circuitsCompleted} />
      <input type="hidden" name="roundsCompleted" value={roundsCompleted} />
      <input type="hidden" name="hadFailures" value={hadFailures ? "1" : "0"} />
      <input type="hidden" name="substitutionsJson" value={JSON.stringify(subs)} />
      <input type="hidden" name="weightsJson" value={weightsJson} />

      {hadFailures && (
        <div className="rounded-md border border-[#B94A48]/30 bg-[#B94A48]/10 p-3 text-sm text-[#B94A48]">
          You had one or more failures — repeat this workout tomorrow with the same exercises.
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-md bg-[#F7F3EA] p-3">
          <p className="text-xs text-[#6B756F]">Total time</p>
          <p className="font-semibold">{Math.round(totalSeconds / 60)} min</p>
        </div>
        <div className="rounded-md bg-[#F7F3EA] p-3">
          <p className="text-xs text-[#6B756F]">Circuits</p>
          <p className="font-semibold">{circuitsCompleted}</p>
        </div>
        <div className="rounded-md bg-[#F7F3EA] p-3">
          <p className="text-xs text-[#6B756F]">Load</p>
          <p className="font-semibold">By effort</p>
        </div>
      </div>

      {subs.length > 0 && (
        <div className="rounded-md border border-[#E4DCCB] bg-[#F7F3EA] p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#6B756F]">{subs.length} swap{subs.length > 1 ? "s" : ""} made</p>
          <div className="grid gap-1.5">
            {subs.map((s) => (
              <div key={s.originalExerciseName} className="flex items-center gap-2 text-xs text-[#10251D]">
                <span className="text-[#6B756F] line-through">{s.originalExerciseName}</span>
                <span>→</span>
                <span className="font-medium">{s.substitutedExerciseName}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="mb-2 text-sm font-semibold">How hard was this workout?</p>
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((score) => (
            <label key={score}>
              <input className="peer sr-only" type="radio" name="effortScore" value={score} required defaultChecked={score === 4} />
              <span className="grid h-12 place-items-center rounded-md border border-[#E4DCCB] peer-checked:border-[#0F4A32] peer-checked:bg-[#0F4A32] peer-checked:text-white">{score}</span>
            </label>
          ))}
        </div>
      </div>
      <textarea name="notes" className={`${inputClass} h-28 py-3`} placeholder="Optional notes" />
      <Button>Finish</Button>
    </form>
  );
}

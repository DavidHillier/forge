"use client";

import { useEffect, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { SubstituteSheet } from "./substitute-sheet";
import {
  buildSubstitutionMap,
  getCanonicalName,
  isSwappable,
  isWeightedExercise,
  loadSubstitutions,
  loadWeights,
  saveSubstitutions,
  saveWeights,
  stripTarget,
} from "@/lib/substitutions/logic";
import type { SubstituteOption, SubstitutionReason, WorkoutSubstitutionEntry } from "@/lib/substitutions/types";

type Exercise = {
  id: string;
  name: string;
  workSeconds: number;
  restSeconds: number;
};

type Block = {
  id: string;
  name: string;
  durationMinutes: number;
  exercises: Exercise[];
};

type Props = {
  workoutId: string;
  blocks: Block[];
  substitutesByCanonical: Record<string, SubstituteOption[]>;
  userEquipment: string[];
  lastWeights: Record<string, number>;
  units: string;
};

export function WorkoutPreviewExercises({ workoutId, blocks, substitutesByCanonical, userEquipment, lastWeights, units }: Props) {
  const [subs, setSubs] = useState<WorkoutSubstitutionEntry[]>([]);
  const [weights, setWeights] = useState<Record<string, number>>({});
  const [sheetFor, setSheetFor] = useState<string | null>(null); // exercise display name
  const unitLabel = units === "imperial" ? "lb" : "kg";

  useEffect(() => {
    setSubs(loadSubstitutions(workoutId));
    const stored = loadWeights(workoutId);
    // Merge stored weights over lastWeights so session edits persist on re-render
    setWeights({ ...lastWeights, ...stored });
  }, [workoutId, lastWeights]);

  function handleWeightChange(baseName: string, value: string) {
    const num = parseFloat(value);
    const next = { ...weights };
    if (!value || isNaN(num)) {
      delete next[baseName];
    } else {
      next[baseName] = num;
    }
    setWeights(next);
    saveWeights(workoutId, next);
  }

  const subsMap = buildSubstitutionMap(subs);

  function handleSelect(originalDisplayName: string, sub: SubstituteOption, reason: SubstitutionReason) {
    const baseName = stripTarget(originalDisplayName);
    const next: WorkoutSubstitutionEntry = {
      originalExerciseName: baseName,
      substitutedExerciseName: sub.substitute.name,
      substitutionReason: reason,
    };
    const updated = subs.filter((s) => s.originalExerciseName !== baseName).concat(next);
    setSubs(updated);
    saveSubstitutions(workoutId, updated);
    setSheetFor(null);
  }

  const activeSheet = sheetFor ? blocks.flatMap((b) => b.exercises).find((e) => e.name === sheetFor) : null;
  const activeCanonical = activeSheet ? getCanonicalName(activeSheet.name) : null;
  const activeSubstitutes = activeCanonical ? (substitutesByCanonical[activeCanonical] ?? []) : [];

  return (
    <>
      {blocks.map((block) => (
        <div key={block.id} className="rounded-xl border border-[#E4DCCB] bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-[var(--font-display)] text-2xl font-semibold">{block.name}</h2>
            <span className="text-sm text-[#6B756F]">{block.durationMinutes} min</span>
          </div>
          <div className="grid gap-2">
            {block.exercises.map((exercise) => {
              const baseName = stripTarget(exercise.name);
              const swapped = subsMap.get(baseName);
              const swappable = isSwappable(exercise.name);
              const weighted = isWeightedExercise(exercise.name);
              const currentWeight = weights[baseName];
              const isFromHistory = currentWeight !== undefined && lastWeights[baseName] === currentWeight;
              return (
                <div key={exercise.id} className="rounded-md bg-[#F7F3EA] p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      {swapped ? (
                        <>
                          <span className="font-medium">{swapped.substitutedExerciseName}</span>
                          <span className="ml-2 text-xs text-[#6B756F]">was: {baseName}</span>
                        </>
                      ) : (
                        <span>{exercise.name}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {weighted && (
                        <div className="flex flex-col items-end">
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              inputMode="decimal"
                              step="0.5"
                              min="0"
                              value={currentWeight ?? ""}
                              onChange={(e) => handleWeightChange(baseName, e.target.value)}
                              placeholder="—"
                              className="w-16 rounded border border-[#D9D0BE] bg-white px-2 py-1 text-right text-sm tabular-nums focus:border-[#1B3D2F] focus:outline-none"
                            />
                            <span className="text-xs text-[#6B756F]">{unitLabel}</span>
                          </div>
                          {isFromHistory && (
                            <span className="mt-0.5 text-[10px] text-[#9BA89E]">prev session</span>
                          )}
                        </div>
                      )}
                      <span className="text-[#6B756F]">{exercise.workSeconds}s · {exercise.restSeconds}s rest</span>
                      {swappable && (
                        <button
                          onClick={() => setSheetFor(exercise.name)}
                          className="flex items-center gap-1 rounded-md bg-[#1B3D2F] px-2 py-1 text-xs text-white hover:bg-[#0F4A32] transition-colors"
                          title="Swap exercise"
                        >
                          <ArrowLeftRight size={12} />
                          {swapped ? "Re-swap" : "Swap"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {sheetFor && (
        <SubstituteSheet
          exerciseDisplayName={sheetFor}
          substitutes={activeSubstitutes}
          userEquipment={userEquipment}
          onSelect={(sub, reason) => handleSelect(sheetFor, sub, reason)}
          onClose={() => setSheetFor(null)}
        />
      )}
    </>
  );
}

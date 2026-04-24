"use client";

import { useEffect, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { SubstituteSheet } from "./substitute-sheet";
import {
  buildSubstitutionMap,
  extractTarget,
  getCanonicalName,
  isSwappable,
  isWeightedExercise,
  loadSubstitutions,
  loadTargetOverrides,
  loadWeights,
  saveSubstitutions,
  saveTargetOverrides,
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
  blockType: string;
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
  generatedExercises?: { exerciseId: string; exerciseName: string }[];
};

export function WorkoutPreviewExercises({
  workoutId,
  blocks,
  substitutesByCanonical,
  userEquipment,
  lastWeights,
  units,
  generatedExercises,
}: Props) {
  const [subs, setSubs] = useState<WorkoutSubstitutionEntry[]>([]);
  const [weights, setWeights] = useState<Record<string, number>>({});
  const [targetOverrides, setTargetOverrides] = useState<Record<string, string>>({});
  const [sheetFor, setSheetFor] = useState<string | null>(null);
  const unitLabel = units === "imperial" ? "lb" : "kg";

  useEffect(() => {
    setSubs(loadSubstitutions(workoutId));
    const stored = loadWeights(workoutId);
    setWeights({ ...lastWeights, ...stored });
    setTargetOverrides(loadTargetOverrides(workoutId));
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

  function handleTargetChange(baseName: string, defaultTarget: string, value: string) {
    const next = { ...targetOverrides };
    if (!value || value === defaultTarget) {
      delete next[baseName];
    } else {
      next[baseName] = value;
    }
    setTargetOverrides(next);
    saveTargetOverrides(workoutId, next);
  }

  const subsMap = buildSubstitutionMap(subs);

  // Build map of exerciseId -> generated exercise name
  const generatedMap = new Map<string, string>();
  for (const entry of generatedExercises ?? []) {
    generatedMap.set(entry.exerciseId, entry.exerciseName);
  }

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
      {blocks.map((block) => {
        const isMain = block.blockType === "main";
        return (
          <div key={block.id} className="rounded-xl border border-[#E4DCCB] bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-[var(--font-display)] text-2xl font-semibold">{block.name}</h2>
              <span className="text-sm text-[#6B756F]">{block.durationMinutes} min</span>
            </div>
            <div className="grid gap-2">
              {block.exercises.map((exercise) => {
                const baseName = stripTarget(exercise.name);
                const defaultTarget = extractTarget(exercise.name);
                const currentTarget = targetOverrides[baseName] ?? defaultTarget;
                const targetChanged = targetOverrides[baseName] !== undefined && targetOverrides[baseName] !== defaultTarget;
                const swapped = subsMap.get(baseName);
                const generatedName = generatedMap.get(exercise.id);
                const swappable = isSwappable(exercise.name);
                const weighted = isWeightedExercise(exercise.name);
                const currentWeight = weights[baseName];
                const isFromHistory = currentWeight !== undefined && lastWeights[baseName] === currentWeight;

                // Resolved display name: substitution > generated > original
                const displayName = swapped?.substitutedExerciseName ?? generatedName ?? (isMain ? baseName : exercise.name);
                const originalLabel = swapped ? baseName : (generatedName && generatedName !== baseName ? baseName : null);

                return (
                  <div key={exercise.id} className="rounded-md bg-[#F7F3EA] p-3 text-sm">
                    <div className="flex items-start justify-between gap-2">
                      {/* Left: name + editable target for main exercises */}
                      <div className="min-w-0">
                        <div>
                          <span className="font-medium">{displayName}</span>
                          {originalLabel && (
                            <span className="ml-2 text-xs text-[#6B756F]">was: {originalLabel}</span>
                          )}
                        </div>
                        {isMain && defaultTarget && (
                          <div className="mt-1.5 flex items-center gap-1.5">
                            <span className="text-xs text-[#6B756F]">Target:</span>
                            <input
                              type="text"
                              value={currentTarget}
                              onChange={(e) => handleTargetChange(baseName, defaultTarget, e.target.value)}
                              className={`w-20 rounded border px-1.5 py-0.5 text-xs tabular-nums focus:outline-none focus:border-[#1B3D2F] ${
                                targetChanged
                                  ? "border-[#C9A84C] bg-[#FBF8F1] text-[#7A5C1A] font-medium"
                                  : "border-[#D9D0BE] bg-white text-[#6B756F]"
                              }`}
                            />
                            {targetChanged && (
                              <button
                                onClick={() => handleTargetChange(baseName, defaultTarget, defaultTarget)}
                                className="text-[10px] text-[#9BA89E] underline"
                              >
                                reset
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Right: weight, swap */}
                      <div className="flex shrink-0 items-center gap-2">
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
                                className="w-14 rounded border border-[#D9D0BE] bg-white px-2 py-1 text-right text-xs tabular-nums focus:border-[#1B3D2F] focus:outline-none"
                              />
                              <span className="text-xs text-[#6B756F]">{unitLabel}</span>
                            </div>
                            {isFromHistory && (
                              <span className="mt-0.5 text-[10px] text-[#9BA89E]">prev</span>
                            )}
                          </div>
                        )}
                        {swappable && (
                          <button
                            onClick={() => setSheetFor(exercise.name)}
                            className="flex items-center gap-1 rounded-md bg-[#1B3D2F] px-2 py-1 text-xs text-white hover:bg-[#0F4A32] transition-colors"
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
        );
      })}

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

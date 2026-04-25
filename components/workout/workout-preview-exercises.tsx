"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
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
import type { SubstituteOption, WorkoutSubstitutionEntry } from "@/lib/substitutions/types";

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
  lastWeights: Record<string, number>;
  units: string;
  generatedExercises?: { exerciseId: string; exerciseName: string }[];
};

export function WorkoutPreviewExercises({
  workoutId,
  blocks,
  substitutesByCanonical,
  lastWeights,
  units,
  generatedExercises,
}: Props) {
  const [subs, setSubs] = useState<WorkoutSubstitutionEntry[]>(() => loadSubstitutions(workoutId));
  const [weights, setWeights] = useState<Record<string, number>>(() => ({ ...lastWeights, ...loadWeights(workoutId) }));
  const [targetOverrides, setTargetOverrides] = useState<Record<string, string>>(() => loadTargetOverrides(workoutId));
  const [openDropdownFor, setOpenDropdownFor] = useState<string | null>(null);
  const unitLabel = units === "imperial" ? "lb" : "kg";

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

  function handleSelect(originalDisplayName: string, sub: SubstituteOption) {
    const baseName = stripTarget(originalDisplayName);
    const next: WorkoutSubstitutionEntry = {
      originalExerciseName: baseName,
      substitutedExerciseName: sub.substitute.name,
      substitutionReason: sub.substitutionReasons.includes("closest_match")
        ? "closest_match"
        : (sub.substitutionReasons[0] ?? "closest_match"),
    };
    const updated = subs.filter((s) => s.originalExerciseName !== baseName).concat(next);
    setSubs(updated);
    saveSubstitutions(workoutId, updated);
    setOpenDropdownFor(null);
  }

  function handleReset(originalDisplayName: string) {
    const baseName = stripTarget(originalDisplayName);
    const updated = subs.filter((s) => s.originalExerciseName !== baseName);
    setSubs(updated);
    saveSubstitutions(workoutId, updated);
    setOpenDropdownFor(null);
  }

  return (
    <>
      {blocks.filter((b) => b.blockType !== "warmup" && b.blockType !== "cooldown").map((block) => {
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
                const canonicalName = getCanonicalName(exercise.name);
                const substituteOptions = canonicalName ? (substitutesByCanonical[canonicalName] ?? []) : [];
                const dropdownOpen = openDropdownFor === exercise.id;

                // Resolved display name: substitution > generated > original
                const displayName = swapped?.substitutedExerciseName ?? generatedName ?? (isMain ? baseName : exercise.name);
                const originalLabel = swapped ? baseName : (generatedName && generatedName !== baseName ? baseName : null);

                return (
                  <div key={exercise.id} className="rounded-md bg-[#F7F3EA] p-3 text-sm">
                    <div className="flex items-start justify-between gap-2">
                      {/* Left: name + editable target for main exercises */}
                      <div className="min-w-0">
                        <div className="relative">
                          {swappable ? (
                            <button
                              type="button"
                              onClick={() => setOpenDropdownFor(dropdownOpen ? null : exercise.id)}
                              className="inline-flex items-center gap-1 rounded-sm text-left font-medium underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                              aria-expanded={dropdownOpen}
                            >
                              {displayName}
                              <ChevronDown size={14} className={dropdownOpen ? "rotate-180 transition-transform" : "transition-transform"} />
                            </button>
                          ) : (
                            <span className="font-medium">{displayName}</span>
                          )}
                          {originalLabel && (
                            <span className="ml-2 text-xs text-[#6B756F]">was: {originalLabel}</span>
                          )}
                          {dropdownOpen && (
                            <div className="absolute left-0 top-7 z-20 w-72 overflow-hidden rounded-lg border border-[#D9D0BE] bg-white shadow-xl">
                              <div className="border-b border-[#E4DCCB] px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[#6B756F]">
                                Choose substitute
                              </div>
                              <button
                                type="button"
                                onClick={() => handleReset(exercise.name)}
                                className="block w-full px-3 py-2 text-left text-sm hover:bg-[#F7F3EA]"
                              >
                                Original: {baseName}
                              </button>
                              {substituteOptions.length === 0 ? (
                                <p className="px-3 py-3 text-sm text-[#6B756F]">No substitutes available.</p>
                              ) : (
                                <div className="max-h-72 overflow-y-auto">
                                  {substituteOptions.map((sub) => (
                                    <button
                                      key={sub.id}
                                      type="button"
                                      onClick={() => handleSelect(exercise.name, sub)}
                                      className="block w-full border-t border-[#F7F3EA] px-3 py-2 text-left hover:bg-[#F7F3EA]"
                                    >
                                      <span className="block text-sm font-semibold">{sub.substitute.name}</span>
                                      <span className="mt-0.5 block text-xs text-[#6B756F]">
                                        {sub.substitute.equipment.join(", ")} · {sub.matchQuality} match
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
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
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}

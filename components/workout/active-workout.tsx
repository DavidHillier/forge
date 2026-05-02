"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import {
  buildSubstitutionMap,
  extractTarget,
  getCanonicalName,
  isWeightedExercise,
  loadSubstitutions,
  loadTargetOverrides,
  loadWeights,
  saveSubstitutions,
  saveTargetOverrides,
  saveWeights,
  stripTarget,
} from "@/lib/substitutions/logic";
import { getSubstitutesForExercise } from "@/lib/substitutions/queries";
import type { SubstituteOption, WorkoutSubstitutionEntry } from "@/lib/substitutions/types";
import type { WorkoutForEngine } from "@/lib/workout-engine/workout";
import { calculateCircuitsForWorkout } from "@/lib/workout-engine/workout";
import { CIRCUITS_PER_PASS } from "@/lib/level/logic";

type Block = WorkoutForEngine["blocks"][number];
type Exercise = Block["exercises"][number];

interface SequenceItem {
  block: Block;
  exercise: Exercise;
  circuitNum: number;
}

interface ActiveState {
  idx: number;
  hasAnyFailure: boolean;
  startedAt: number;
}

export function ActiveWorkout({
  workout,
  weekNumber,
  completedCircuitsThisLevel,
  generatedExercises,
}: {
  workout: WorkoutForEngine & { id: string };
  weekNumber: number;
  completedCircuitsThisLevel: number;
  generatedExercises?: { exerciseId: string; exerciseName: string }[];
}) {
  const router = useRouter();
  const circuitsRequired = calculateCircuitsForWorkout(weekNumber, workout);

  const blocks = useMemo(
    () => [...workout.blocks].sort((a, b) => a.order - b.order),
    [workout],
  );

  // Reactive substitutions — updated when user swaps mid-workout
  const [substitutions, setSubstitutions] = useState<WorkoutSubstitutionEntry[]>([]);
  const [targetOverrides, setTargetOverrides] = useState<Record<string, string>>({});

  useEffect(() => {
    setSubstitutions(loadSubstitutions(workout.id));
    setTargetOverrides(loadTargetOverrides(workout.id));
  }, [workout.id]);

  const subsMap = useMemo(() => buildSubstitutionMap(substitutions), [substitutions]);

  const generatedMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const entry of generatedExercises ?? []) {
      map.set(entry.exerciseId, entry.exerciseName);
    }
    return map;
  }, [generatedExercises]);

  const sequence = useMemo<SequenceItem[]>(() => {
    const items: SequenceItem[] = [];
    for (const block of blocks) {
      if (block.blockType === "warmup" || block.blockType === "cooldown") continue;
      const sortedExercises = block.exercises.slice().sort((a, b) => a.order - b.order);
      const times = block.blockType === "main" ? circuitsRequired : 1;
      for (let ci = 0; ci < times; ci++) {
        for (const exercise of sortedExercises) {
          items.push({ block, exercise, circuitNum: ci + 1 });
        }
      }
    }
    return items;
  }, [blocks, circuitsRequired]);

  const [state, setState] = useState<ActiveState>({
    idx: 0,
    hasAnyFailure: false,
    startedAt: Date.now(),
  });

  const [showCue, setShowCue] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editSubs, setEditSubs] = useState<SubstituteOption[] | null>(null);
  const [loadingSubs, setLoadingSubs] = useState(false);
  // Local draft of the target while the edit modal is open
  const [draftTarget, setDraftTarget] = useState("");

  // Weights — loaded from sessionStorage, updated inline during workout
  const [weights, setWeights] = useState<Record<string, number>>({});
  useEffect(() => {
    setWeights(loadWeights(workout.id));
  }, [workout.id]);

  function handleWeightChange(baseName: string, value: string) {
    const num = parseFloat(value);
    const next = { ...weights };
    if (!value || isNaN(num) || num <= 0) {
      delete next[baseName];
    } else {
      next[baseName] = num;
    }
    setWeights(next);
    saveWeights(workout.id, next);
  }

  // Redirect when sequence is exhausted
  useEffect(() => {
    if (state.idx < sequence.length) return;
    const totalSeconds = Math.round((Date.now() - state.startedAt) / 1000);
    const href = `/app/workout/${workout.id}/complete?total=${totalSeconds}&circuits=${circuitsRequired}&failed=${state.hasAnyFailure ? 1 : 0}`;
    router.push(href);
  }, [circuitsRequired, router, sequence.length, state]);

  if (state.idx >= sequence.length) return null;

  const current = sequence[state.idx]!;
  const { block: currentBlock, exercise: currentExercise, circuitNum } = current;
  const isMainBlock = currentBlock.blockType === "main";

  // Resolve display name: generated → substituted → original
  const originalBaseName = stripTarget(currentExercise.name);
  const generatedName = generatedMap.get(currentExercise.id);
  const subsEntry = subsMap.get(originalBaseName);
  const resolvedBaseName = generatedName ?? subsEntry?.substitutedExerciseName ?? originalBaseName;
  const wasSubstituted = resolvedBaseName !== originalBaseName;

  const defaultTarget = extractTarget(currentExercise.name);
  const activeTarget = targetOverrides[originalBaseName] ?? defaultTarget;

  // Check if the resolved (possibly generated/swapped) exercise is weighted
  const resolvedIsWeighted = isWeightedExercise(currentExercise.name)
    || (resolvedBaseName !== originalBaseName && resolvedBaseName.toLowerCase().startsWith("dumbbell"))
    || (resolvedBaseName !== originalBaseName && resolvedBaseName.toLowerCase().startsWith("kettlebell"))
    || (resolvedBaseName !== originalBaseName && resolvedBaseName.toLowerCase().startsWith("barbell"));

  const currentWeight = weights[originalBaseName];

  const formCues = Array.isArray(currentExercise.formCues)
    ? currentExercise.formCues.map(String)
    : [];

  const passNum = Math.floor(completedCircuitsThisLevel / CIRCUITS_PER_PASS) + 1;
  const passesNeeded = weekNumber; // level N = N passes
  const passLabel = passesNeeded > 1 ? `Week ${passNum} of ${passesNeeded} · ` : "";
  const circuitLabel = isMainBlock
    ? `${passLabel}Circuit ${circuitNum} of ${circuitsRequired}`
    : (currentBlock.name ?? "");

  const totalInBlock = sequence.filter(
    (s) => s.block.id === currentBlock.id && s.circuitNum === circuitNum,
  ).length;
  const posInBlock = sequence
    .slice(0, state.idx + 1)
    .filter((s) => s.block.id === currentBlock.id && s.circuitNum === circuitNum)
    .length;

  function advance(failed: boolean) {
    setState((prev) => ({
      idx: prev.idx + 1,
      hasAnyFailure: prev.hasAnyFailure || failed,
      startedAt: prev.startedAt,
    }));
    setShowCue(false);
    setEditSubs(null); // reset so next exercise fetches its own substitutes
  }

  async function openEdit() {
    setDraftTarget(activeTarget);
    setShowEdit(true);

    const canonicalName = getCanonicalName(originalBaseName);
    if (!canonicalName || editSubs !== null) return;

    setLoadingSubs(true);
    try {
      const subs = await getSubstitutesForExercise(canonicalName);
      setEditSubs(subs);
    } catch {
      setEditSubs([]);
    } finally {
      setLoadingSubs(false);
    }
  }

  function closeEdit() {
    setShowEdit(false);
  }

  function applyTargetChange() {
    const trimmed = draftTarget.trim();
    const next = { ...targetOverrides };
    if (!trimmed || trimmed === defaultTarget) {
      delete next[originalBaseName];
    } else {
      next[originalBaseName] = trimmed;
    }
    setTargetOverrides(next);
    saveTargetOverrides(workout.id, next);
  }

  function handleSwap(sub: SubstituteOption) {
    const newEntry: WorkoutSubstitutionEntry = {
      originalExerciseName: originalBaseName,
      substitutedExerciseName: sub.substitute.name,
      substitutionReason: "closest_match",
    };
    const next = substitutions.filter((s) => s.originalExerciseName !== originalBaseName);
    next.push(newEntry);
    setSubstitutions(next);
    saveSubstitutions(workout.id, next);
    closeEdit();
  }

  function handleRevert() {
    const next = substitutions.filter((s) => s.originalExerciseName !== originalBaseName);
    setSubstitutions(next);
    saveSubstitutions(workout.id, next);
    closeEdit();
  }

  return (
    <div className="green-gradient min-h-screen px-4 py-6 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-lg flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between">
          <ButtonLink
            href={`/app/workout/${workout.id}/preview`}
            variant="ghost"
            className="size-11 rounded-full p-0"
          >
            <X size={18} />
          </ButtonLink>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#C9A24D]">
            Active Workout
          </p>
          <div className="size-11" />
        </div>

        <section className="text-center">
          <p className="mb-2 text-sm text-[#F7F3EA]/60 uppercase tracking-wider">
            Level {weekNumber} · {circuitLabel}
          </p>
          <p className="mb-6 text-xs text-[#F7F3EA]/50">
            {posInBlock} / {totalInBlock}
          </p>

          {/* Exercise name — scales down for long names */}
          <h1 className="font-[var(--font-display)] font-bold leading-tight hyphens-auto break-words"
              style={{ fontSize: resolvedBaseName.length > 20 ? "clamp(1.6rem, 6vw, 2.5rem)" : "clamp(2rem, 8vw, 3rem)" }}>
            {resolvedBaseName}
          </h1>

          {activeTarget && (
            <p className="mt-2 text-lg text-[#C9A84C] font-semibold tabular-nums">{activeTarget}</p>
          )}
          {wasSubstituted && (
            <p className="mt-1 text-xs text-[#F7F3EA]/40">Originally: {originalBaseName}</p>
          )}

          {/* Inline weight input for weighted exercises */}
          {resolvedIsWeighted && (
            <div className="mt-5 flex items-center justify-center gap-2">
              <input
                type="number"
                inputMode="decimal"
                step="0.5"
                min="0"
                value={currentWeight ?? ""}
                onChange={(e) => handleWeightChange(originalBaseName, e.target.value)}
                placeholder="—"
                className="w-20 rounded-lg border border-[#C9A84C]/40 bg-white/10 px-3 py-2 text-center text-lg font-semibold tabular-nums text-white placeholder-white/30 focus:border-[#C9A84C] focus:outline-none"
              />
              <span className="text-sm text-[#F7F3EA]/60">kg / lb</span>
            </div>
          )}

          {state.hasAnyFailure && (
            <p className="mt-4 text-xs text-[#F7A9A7]/70">Workout has failures — continue and redo tomorrow</p>
          )}

          <div className="mt-5 flex items-center justify-center gap-5">
            <button
              onClick={() => setShowCue(true)}
              className="text-sm text-[#C9A24D] underline underline-offset-4"
            >
              Form cues
            </button>
            <button
              onClick={openEdit}
              className="text-sm text-[#C9A24D] underline underline-offset-4"
            >
              Edit
            </button>
          </div>
        </section>

        <div className={`grid gap-3 ${isMainBlock ? "grid-cols-2" : "grid-cols-1"}`}>
          {isMainBlock && (
            <button
              onClick={() => advance(true)}
              className="h-16 rounded-full border border-[#B94A48]/50 bg-[#B94A48]/20 text-[#F7A9A7] text-base font-semibold transition hover:bg-[#B94A48]/35"
            >
              Fail
            </button>
          )}
          <button
            onClick={() => advance(false)}
            className="h-16 rounded-full bg-[#C9A84C] text-[#1B3D2F] text-base font-semibold transition hover:bg-[#d4b55a]"
          >
            Done ✓
          </button>
        </div>
      </div>

      {/* Form cue modal */}
      {showCue && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4">
          <div className="w-full max-w-sm rounded-lg bg-[#FBF8F1] p-5 text-[#10251D]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-[var(--font-display)] text-xl font-semibold">{resolvedBaseName}</h2>
              <button onClick={() => setShowCue(false)}>
                <X size={18} />
              </button>
            </div>
            <ul className="grid gap-2 text-sm">
              {formCues.map((cue) => (
                <li key={cue} className="rounded-md bg-[#F7F3EA] p-3">
                  {cue}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm font-semibold text-[#B94A48]">
              {currentExercise.safetyCue}
            </p>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {showEdit && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4">
          <div className="w-full max-w-sm rounded-lg bg-[#FBF8F1] text-[#10251D] overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4">
              <h2 className="font-[var(--font-display)] text-xl font-semibold">Edit exercise</h2>
              <button onClick={closeEdit} className="text-[#10251D]/50 hover:text-[#10251D]">
                <X size={18} />
              </button>
            </div>

            <div className="px-5 pb-5 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Target / reps */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#10251D]/50">
                  Reps / Time
                </label>
                <input
                  type="text"
                  value={draftTarget}
                  onChange={(e) => setDraftTarget(e.target.value)}
                  onBlur={applyTargetChange}
                  className="w-full rounded-lg border border-[#10251D]/15 bg-[#F7F3EA] px-3 py-2.5 text-base font-semibold text-[#10251D] focus:border-[#1B3D2F] focus:outline-none"
                  placeholder={defaultTarget}
                />
              </div>

              {/* Swap exercise */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#10251D]/50">
                  Swap exercise
                </p>

                {loadingSubs && (
                  <p className="py-3 text-center text-sm text-[#10251D]/40">Loading options…</p>
                )}

                {!loadingSubs && editSubs !== null && editSubs.length === 0 && (
                  <p className="py-3 text-center text-sm text-[#10251D]/40">No substitutes available</p>
                )}

                {!loadingSubs && editSubs !== null && editSubs.length > 0 && (
                  <ul className="grid gap-2">
                    {/* Current / original exercise at top */}
                    <li>
                      <button
                        onClick={handleRevert}
                        className={`w-full rounded-lg px-3 py-2.5 text-left transition ${
                          !wasSubstituted
                            ? "border-2 border-[#1B3D2F] bg-[#1B3D2F]/8"
                            : "border border-[#10251D]/12 bg-[#F7F3EA] hover:bg-[#EEE9DC]"
                        }`}
                      >
                        <span className="block text-sm font-semibold text-[#10251D]">{originalBaseName}</span>
                        <span className="block text-xs text-[#10251D]/50">Original</span>
                      </button>
                    </li>

                    {editSubs.map((sub) => {
                      const isSelected = subsEntry?.substitutedExerciseName === sub.substitute.name;
                      return (
                        <li key={sub.substitute.id}>
                          <button
                            onClick={() => handleSwap(sub)}
                            className={`w-full rounded-lg px-3 py-2.5 text-left transition ${
                              isSelected
                                ? "border-2 border-[#1B3D2F] bg-[#1B3D2F]/8"
                                : "border border-[#10251D]/12 bg-[#F7F3EA] hover:bg-[#EEE9DC]"
                            }`}
                          >
                            <span className="block text-sm font-semibold text-[#10251D]">
                              {sub.substitute.name}
                            </span>
                            <span className="block text-xs text-[#10251D]/50">
                              {sub.substitute.difficulty} · {(sub.substitute.equipment as string[]).join(", ")}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}

                {!loadingSubs && editSubs === null && getCanonicalName(originalBaseName) === null && (
                  <p className="py-3 text-center text-sm text-[#10251D]/40">No substitutes available for this exercise</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import {
  buildSubstitutionMap,
  extractTarget,
  loadSubstitutions,
  loadTargetOverrides,
  stripTarget,
} from "@/lib/substitutions/logic";
import type { WorkoutForEngine } from "@/lib/workout-engine/workout";
import { calculateCircuitsForWorkout } from "@/lib/workout-engine/workout";

type Block = WorkoutForEngine["blocks"][number];
type Exercise = Block["exercises"][number];

interface SequenceItem {
  block: Block;
  exercise: Exercise;
  circuitNum: number; // 1-based, only meaningful for main blocks
}

interface ActiveState {
  idx: number;
  hasAnyFailure: boolean;
  startedAt: number;
}

export function ActiveWorkout({
  workout,
  weekNumber,
  generatedExercises,
}: {
  workout: WorkoutForEngine & { id: string };
  weekNumber: number;
  generatedExercises?: { exerciseId: string; exerciseName: string }[];
}) {
  const router = useRouter();
  const circuitsRequired = calculateCircuitsForWorkout(weekNumber, workout);

  const blocks = useMemo(
    () => [...workout.blocks].sort((a, b) => a.order - b.order),
    [workout],
  );

  const subsMap = useMemo(
    () => buildSubstitutionMap(loadSubstitutions(workout.id)),
    [workout.id],
  );

  const targetOverrides = useMemo(() => loadTargetOverrides(workout.id), [workout.id]);

  // Map exerciseId -> generated exercise name (base name, no target suffix)
  const generatedMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const entry of generatedExercises ?? []) {
      map.set(entry.exerciseId, entry.exerciseName);
    }
    return map;
  }, [generatedExercises]);

  // Pre-expand the full workout sequence
  const sequence = useMemo<SequenceItem[]>(() => {
    const items: SequenceItem[] = [];
    for (const block of blocks) {
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

  // Workout done
  if (state.idx >= sequence.length) {
    const totalSeconds = Math.round((Date.now() - state.startedAt) / 1000);
    const href = `/app/workout/${workout.id}/complete?total=${totalSeconds}&circuits=${circuitsRequired}&failed=${state.hasAnyFailure ? 1 : 0}`;
    router.push(href);
    return null;
  }

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

  const formCues = Array.isArray(currentExercise.formCues)
    ? currentExercise.formCues.map(String)
    : [];

  const circuitLabel = isMainBlock
    ? `Circuit ${circuitNum} of ${circuitsRequired}`
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
            Week {weekNumber} · {circuitLabel}
          </p>
          <p className="mb-6 text-xs text-[#F7F3EA]/50">
            {posInBlock} / {totalInBlock}
          </p>
          <h1 className="font-[var(--font-display)] text-4xl font-bold leading-tight">
            {resolvedBaseName}
          </h1>
          {activeTarget && (
            <p className="mt-2 text-lg text-[#C9A84C] font-semibold tabular-nums">{activeTarget}</p>
          )}
          {wasSubstituted && (
            <p className="mt-1 text-xs text-[#F7F3EA]/40">Originally: {originalBaseName}</p>
          )}
          {state.hasAnyFailure && (
            <p className="mt-3 text-xs text-[#F7A9A7]/70">Workout has failures — continue and redo tomorrow</p>
          )}
          <button
            onClick={() => setShowCue(true)}
            className="mt-6 text-sm text-[#C9A24D] underline underline-offset-4"
          >
            Form cues
          </button>
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
    </div>
  );
}

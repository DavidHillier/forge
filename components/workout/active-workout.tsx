"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
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

type Screen = "exercise" | "circuit_result";

interface ActiveState {
  blockIdx: number;
  exerciseIdx: number;
  circuitsClean: number;
  failedThisPass: Set<number>; // exercise indices failed in current circuit pass
  screen: Screen;
  startedAt: number;
}

export function ActiveWorkout({
  workout,
  weekNumber,
}: {
  workout: WorkoutForEngine & { id: string };
  weekNumber: number;
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

  const [state, setState] = useState<ActiveState>({
    blockIdx: 0,
    exerciseIdx: 0,
    circuitsClean: 0,
    failedThisPass: new Set(),
    screen: "exercise",
    startedAt: Date.now(),
  });

  const [showCue, setShowCue] = useState(false);

  const currentBlock = blocks[state.blockIdx] as Block | undefined;
  const isMainBlock = currentBlock?.blockType === "main";
  const exercises = useMemo(() => currentBlock?.exercises.slice().sort((a, b) => a.order - b.order) ?? [], [currentBlock]);
  const currentExercise = exercises[state.exerciseIdx] as Exercise | undefined;

  function resolvedName(name: string): string {
    const base = stripTarget(name);
    return subsMap.get(base)?.substitutedExerciseName ?? name;
  }

  function navigateAfterExercise(failed: boolean, prevState: ActiveState): ActiveState {
    const newFailed = failed
      ? new Set([...prevState.failedThisPass, prevState.exerciseIdx])
      : prevState.failedThisPass;

    const isLastExercise = prevState.exerciseIdx === exercises.length - 1;

    if (isLastExercise && isMainBlock) {
      return { ...prevState, failedThisPass: newFailed, screen: "circuit_result" };
    }

    if (isLastExercise) {
      // Warmup or cooldown finished — move to next block
      return advanceBlock({ ...prevState, failedThisPass: newFailed });
    }

    return { ...prevState, failedThisPass: newFailed, exerciseIdx: prevState.exerciseIdx + 1 };
  }

  function advanceBlock(prevState: ActiveState): ActiveState {
    const nextBlockIdx = prevState.blockIdx + 1;
    if (nextBlockIdx >= blocks.length) {
      return { ...prevState, blockIdx: blocks.length }; // sentinel → workout done
    }
    return {
      ...prevState,
      blockIdx: nextBlockIdx,
      exerciseIdx: 0,
      failedThisPass: new Set(),
      screen: "exercise",
    };
  }

  function handleDone() {
    setState((prev) => navigateAfterExercise(false, prev));
  }

  function handleFail() {
    setState((prev) => navigateAfterExercise(true, prev));
  }

  function handleCircuitResultContinue() {
    setState((prev) => {
      const passed = prev.failedThisPass.size === 0;
      if (passed) {
        const newClean = prev.circuitsClean + 1;
        if (newClean >= circuitsRequired) {
          return advanceBlock({ ...prev, circuitsClean: newClean });
        }
        return {
          ...prev,
          circuitsClean: newClean,
          exerciseIdx: 0,
          failedThisPass: new Set(),
          screen: "exercise",
        };
      }
      // Failed — repeat circuit
      return {
        ...prev,
        exerciseIdx: 0,
        failedThisPass: new Set(),
        screen: "exercise",
      };
    });
  }

  // Workout done sentinel
  if (state.blockIdx >= blocks.length) {
    const totalSeconds = Math.round((Date.now() - state.startedAt) / 1000);
    const href = `/app/workout/${workout.id}/complete?total=${totalSeconds}&circuits=${state.circuitsClean}&rounds=${state.circuitsClean}`;
    router.push(href);
    return null;
  }

  const formCues = Array.isArray(currentExercise?.formCues)
    ? currentExercise!.formCues.map(String)
    : [];

  const originalBaseName = currentExercise ? stripTarget(currentExercise.name) : "";
  const displayName = currentExercise ? resolvedName(currentExercise.name) : "";
  // For substitutes the resolved name may already be the full name (no target suffix)
  const displayBaseName = stripTarget(displayName);
  const wasSubstituted = displayBaseName !== originalBaseName;
  const defaultTarget = currentExercise ? extractTarget(currentExercise.name) : "";
  const activeTarget = targetOverrides[originalBaseName] ?? defaultTarget;

  const circuitLabel = isMainBlock
    ? `Circuit ${state.circuitsClean + 1} of ${circuitsRequired}`
    : (currentBlock?.name ?? "");

  const failedNames = [...state.failedThisPass].map((idx) => stripTarget(exercises[idx]?.name ?? ""));

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

        {/* Exercise screen */}
        {state.screen === "exercise" && currentExercise && (
          <>
            <section className="text-center">
              <p className="mb-2 text-sm text-[#F7F3EA]/60 uppercase tracking-wider">
                Week {weekNumber} · {circuitLabel}
              </p>
              <p className="mb-6 text-xs text-[#F7F3EA]/50">
                {state.exerciseIdx + 1} / {exercises.length}
              </p>
              <h1 className="font-[var(--font-display)] text-4xl font-bold leading-tight">
                {displayBaseName}
              </h1>
              {activeTarget && (
                <p className="mt-2 text-lg text-[#C9A84C] font-semibold tabular-nums">{activeTarget}</p>
              )}
              {wasSubstituted && (
                <p className="mt-1 text-xs text-[#F7F3EA]/40">Originally: {originalBaseName}</p>
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
                  onClick={handleFail}
                  className="h-16 rounded-full border border-[#B94A48]/50 bg-[#B94A48]/20 text-[#F7A9A7] text-base font-semibold transition hover:bg-[#B94A48]/35"
                >
                  Fail
                </button>
              )}
              <button
                onClick={handleDone}
                className="h-16 rounded-full bg-[#C9A84C] text-[#1B3D2F] text-base font-semibold transition hover:bg-[#d4b55a]"
              >
                Done ✓
              </button>
            </div>
          </>
        )}

        {/* Circuit result screen */}
        {state.screen === "circuit_result" && (
          <>
            <section className="text-center">
              {state.failedThisPass.size === 0 ? (
                <>
                  <div className="mb-4 text-6xl">✓</div>
                  <h2 className="font-[var(--font-display)] text-3xl font-semibold">
                    Circuit complete
                  </h2>
                  <p className="mt-3 text-[#F7F3EA]/70 text-sm">
                    {state.circuitsClean + 1 < circuitsRequired
                      ? `${circuitsRequired - state.circuitsClean - 1} more circuit${circuitsRequired - state.circuitsClean - 1 === 1 ? "" : "s"} to go`
                      : "That's all circuits — well done."}
                  </p>
                </>
              ) : (
                <>
                  <div className="mb-4 text-5xl">↩</div>
                  <h2 className="font-[var(--font-display)] text-3xl font-semibold">
                    Repeat circuit
                  </h2>
                  <p className="mt-2 text-sm text-[#F7F3EA]/60 mb-4">
                    You didn't complete every exercise. Go again.
                  </p>
                  <div className="grid gap-1.5">
                    {failedNames.map((name) => (
                      <p key={name} className="text-sm text-[#F7A9A7]">
                        {name} — failed
                      </p>
                    ))}
                  </div>
                </>
              )}
            </section>

            <button
              onClick={handleCircuitResultContinue}
              className="h-16 w-full rounded-full bg-[#C9A84C] text-[#1B3D2F] text-base font-semibold transition hover:bg-[#d4b55a]"
            >
              {state.failedThisPass.size === 0
                ? state.circuitsClean + 1 >= circuitsRequired
                  ? "Finish Workout"
                  : "Start Next Circuit"
                : "Repeat Circuit"}
            </button>
          </>
        )}
      </div>

      {/* Form cue modal */}
      {showCue && currentExercise && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4">
          <div className="w-full max-w-sm rounded-lg bg-[#FBF8F1] p-5 text-[#10251D]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-[var(--font-display)] text-xl font-semibold">{displayBaseName}</h2>
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

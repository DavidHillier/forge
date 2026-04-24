"use client";

import { useEffect, useMemo, useState } from "react";
import { Pause, Play, SkipForward, X } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { buildSubstitutionMap, loadSubstitutions, stripTarget } from "@/lib/substitutions/logic";
import type { WorkoutForEngine } from "@/lib/workout-engine/workout";
import { buildWorkoutIntervalSequence } from "@/lib/workout-engine/workout";

export function ActiveWorkout({ workout, weekNumber }: { workout: WorkoutForEngine & { id: string }; weekNumber: number }) {
  const intervals = useMemo(() => buildWorkoutIntervalSequence(workout), [workout]);
  const [index, setIndex] = useState(0);
  const [remaining, setRemaining] = useState(intervals[0]?.seconds ?? 0);
  const [running, setRunning] = useState(false);
  const [showCue, setShowCue] = useState(false);
  const [subsMap, setSubsMap] = useState(() => new Map<string, { substitutedExerciseName: string }>());
  const current = intervals[index];
  const next = intervals[index + 1];

  useEffect(() => {
    const stored = loadSubstitutions(workout.id);
    setSubsMap(buildSubstitutionMap(stored));
  }, [workout.id]);

  function resolvedName(name: string): string {
    const base = stripTarget(name);
    return subsMap.get(base)?.substitutedExerciseName ?? name;
  }

  useEffect(() => {
    if (!running || !current) return;
    const timer = window.setInterval(() => {
      setRemaining((value) => {
        if (value > 1) return value - 1;
        setIndex((currentIndex) => {
          const nextIndex = currentIndex + 1;
          setRemaining(intervals[nextIndex]?.seconds ?? 0);
          setRunning(Boolean(intervals[nextIndex]));
          return Math.min(nextIndex, intervals.length - 1);
        });
        return 0;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [running, current, intervals]);

  if (!current) return null;
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const completeHref = `/app/workout/${workout.id}/complete?total=${intervals.reduce((sum, item) => sum + item.seconds, 0)}&circuits=${workout.circuitCount ?? (weekNumber <= 3 ? weekNumber : 4)}&rounds=${intervals.length}`;

  return (
    <div className="green-gradient min-h-screen px-4 py-6 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-lg flex-col justify-between">
        <div className="flex items-center justify-between">
          <ButtonLink href={`/app/workout/${workout.id}/preview`} variant="ghost" className="size-11 rounded-full p-0"><X size={18} /></ButtonLink>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#C9A24D]">Active Workout</p>
          <div className="size-11" />
        </div>
        <section className="text-center">
          <p className="mb-4 text-sm text-[#F7F3EA]/70">Week {weekNumber} · {current.block}</p>
          <div className="mb-4 text-7xl font-semibold tabular-nums text-[#E2C478]">{mm}:{ss}</div>
          <h1 className="font-[var(--font-display)] text-3xl font-semibold">{resolvedName(current.exercise)}</h1>
          {resolvedName(current.exercise) !== current.exercise && (
            <p className="mt-0.5 text-xs text-[#F7F3EA]/50">Originally: {stripTarget(current.exercise)}</p>
          )}
          <p className="mt-1 text-sm uppercase tracking-[0.16em] text-[#F7F3EA]/70">{current.status === "work" ? "Work" : "Rest"} · Round {current.round}</p>
          {next ? <p className="mt-8 text-sm text-[#F7F3EA]/75">Up next<br /><span className="text-lg text-white">{resolvedName(next.exercise)}</span></p> : null}
        </section>
        <div className="grid grid-cols-3 gap-3">
          <Button type="button" variant="ghost" className="h-16 flex-col gap-1 rounded-full bg-transparent text-white" onClick={() => setRunning(!running)}>
            {running ? <Pause /> : <Play />} {running ? "Pause" : "Start"}
          </Button>
          <Button type="button" variant="ghost" className="h-16 flex-col gap-1 rounded-full bg-transparent text-white" onClick={() => {
            const nextIndex = Math.min(index + 1, intervals.length - 1);
            setIndex(nextIndex);
            setRemaining(intervals[nextIndex]?.seconds ?? 0);
          }}>
            <SkipForward /> Skip
          </Button>
          <Button type="button" variant="ghost" className="h-16 flex-col gap-1 rounded-full bg-transparent text-white" onClick={() => setShowCue(true)}>
            ? Cue
          </Button>
        </div>
        <ButtonLink href={completeHref} className="w-full" variant="primary">End and Complete</ButtonLink>
      </div>
      {showCue ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4">
          <div className="w-full max-w-sm rounded-lg bg-[#FBF8F1] p-5 text-[#10251D]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-[var(--font-display)] text-2xl font-semibold">{current.exercise}</h2>
              <button onClick={() => setShowCue(false)}><X size={18} /></button>
            </div>
            <ul className="grid gap-2 text-sm">
              {current.formCues.map((cue) => <li key={cue} className="rounded-md bg-[#F7F3EA] p-3">{cue}</li>)}
            </ul>
            <p className="mt-4 text-sm font-semibold text-[#B94A48]">{current.safetyCue}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

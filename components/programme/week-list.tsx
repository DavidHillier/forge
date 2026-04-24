import Link from "next/link";
import { CheckCircle2, Circle } from "lucide-react";
import { Card } from "@/components/ui/card";

export function WeekList({
  weeks,
  completedKeys,
}: {
  weeks: {
    id: string;
    weekNumber: number;
    title: string;
    theme: string;
    phase: string;
    objective: string;
    circuitCount: number | null;
    workouts: { dayNumber: number }[];
  }[];
  completedKeys: Set<string>;
}) {
  return (
    <div className="grid gap-3">
      {weeks.map((week) => {
        const completedDays = week.workouts.filter((workout) => completedKeys.has(`${week.weekNumber}-${workout.dayNumber}`)).length;
        return (
          <Link key={week.id} href={`/app/programme/week/${week.weekNumber}`}>
            <Card className="flex items-center gap-4 p-4 transition hover:border-[#C9A24D]">
              <div className="grid size-11 place-items-center rounded-full border border-[#E4DCCB] bg-[#F7F3EA] text-sm font-bold text-[#0F4A32]">{week.weekNumber}</div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#B9903D]">{week.phase === "BUILD_UP" ? "Build-Up Phase" : "Main Course"}</p>
                <h2 className="font-[var(--font-display)] text-xl font-semibold">{week.title}</h2>
                <p className="truncate text-sm text-[#6B756F]">{week.theme} · {week.objective}</p>
              </div>
              <div className="text-right text-sm">
                <div className="font-semibold">{completedDays} / 7</div>
                {week.circuitCount ? <div className="text-xs text-[#6B756F]">{week.circuitCount} circuit{week.circuitCount === 1 ? "" : "s"}</div> : null}
              </div>
              {completedDays === 7 ? <CheckCircle2 className="text-[#1E6F4B]" size={20} /> : <Circle className="text-[#B9903D]" size={20} />}
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

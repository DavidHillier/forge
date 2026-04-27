type Completion = {
  completedAt: Date | string;
  totalSeconds: number;
  effortScore: number;
  hadFailures?: boolean;
  workout?: { week?: { weekNumber: number } };
};

// ── Counts ────────────────────────────────────────────────────────────────────

export function countCleanCircuits(completions: Completion[]): number {
  return completions.filter((c) => !c.hadFailures).length;
}

export function countFailedCircuits(completions: Completion[]): number {
  return completions.filter((c) => c.hadFailures).length;
}

// ── Time / effort ─────────────────────────────────────────────────────────────

export function calculateTotalTrainingMinutes(completions: Completion[]): number {
  return Math.round(completions.reduce((sum, c) => sum + c.totalSeconds, 0) / 60);
}

export function calculateAverageEffort(completions: Completion[]): number {
  if (!completions.length) return 0;
  return completions.reduce((sum, c) => sum + c.effortScore, 0) / completions.length;
}

// ── Streak (consecutive calendar days with at least one session) ──────────────

export function calculateCurrentStreak(completions: Completion[], today = new Date()): number {
  const completedDates = new Set(completions.map((c) => isoDay(c.completedAt)));
  let streak = 0;
  const cursor = new Date(today);
  while (completedDates.has(isoDay(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

// ── Sessions this calendar week ───────────────────────────────────────────────

export function calculateWeeklySessions(completions: Completion[], currentDate = new Date()): number {
  const start = startOfWeek(currentDate);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  return completions.filter((c) => {
    const d = new Date(c.completedAt);
    return d >= start && d < end;
  }).length;
}

// ── Chart: sessions per programme level ──────────────────────────────────────

export function levelCompletionChart(completions: Completion[], totalLevels = 9) {
  return Array.from({ length: totalLevels }, (_, i) => {
    const level = i + 1;
    const atLevel = completions.filter((c) => c.workout?.week?.weekNumber === level);
    return {
      level: `L${level}`,
      clean: atLevel.filter((c) => !c.hadFailures).length,
      failed: atLevel.filter((c) => c.hadFailures).length,
    };
  });
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function isoDay(value: Date | string) {
  return new Date(value).toISOString().slice(0, 10);
}

function startOfWeek(value: Date) {
  const date = new Date(value);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.getFullYear(), date.getMonth(), diff);
}

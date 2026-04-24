type Completion = {
  completedAt: Date | string;
  totalSeconds: number;
  effortScore: number;
  workout?: { dayNumber: number; week?: { weekNumber: number } };
};

export function calculateOverallCompletion(completedWorkouts: Completion[]) {
  return uniqueCompletedDays(completedWorkouts).size / 63;
}

export function calculateBuildUpCompletion(completedWorkouts: Completion[]) {
  return countUniqueInRange(completedWorkouts, 1, 3) / 21;
}

export function calculateMainCourseCompletion(completedWorkouts: Completion[]) {
  return countUniqueInRange(completedWorkouts, 4, 9) / 42;
}

export function calculateDaysLeft(completedWorkouts: Completion[]) {
  return Math.max(0, 63 - uniqueCompletedDays(completedWorkouts).size);
}

export function calculateCurrentStreak(completions: Completion[], today = new Date()) {
  const completedDates = new Set(completions.map((completion) => isoDay(completion.completedAt)));
  let streak = 0;
  const cursor = new Date(today);
  while (completedDates.has(isoDay(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function calculateTotalTrainingMinutes(completions: Completion[]) {
  return Math.round(completions.reduce((sum, completion) => sum + completion.totalSeconds, 0) / 60);
}

export function calculateAverageEffort(completions: Completion[]) {
  if (!completions.length) return 0;
  return completions.reduce((sum, completion) => sum + completion.effortScore, 0) / completions.length;
}

export function calculateWeeklySessions(completions: Completion[], currentDate = new Date()) {
  const start = startOfWeek(currentDate);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  return completions.filter((completion) => {
    const completedAt = new Date(completion.completedAt);
    return completedAt >= start && completedAt < end;
  }).length;
}

export function weeklyCompletionChart(completions: Completion[]) {
  return Array.from({ length: 9 }, (_, index) => {
    const week = index + 1;
    return {
      week: `W${week}`,
      sessions: countUniqueInRange(completions, week, week),
      effort: averageEffortForWeek(completions, week),
    };
  });
}

function countUniqueInRange(completions: Completion[], minWeek: number, maxWeek: number) {
  return new Set(
    completions
      .filter((completion) => {
        const week = completion.workout?.week?.weekNumber ?? 0;
        return week >= minWeek && week <= maxWeek;
      })
      .map((completion) => `${completion.workout?.week?.weekNumber}-${completion.workout?.dayNumber}`),
  ).size;
}

function uniqueCompletedDays(completions: Completion[]) {
  return new Set(completions.map((completion) => `${completion.workout?.week?.weekNumber}-${completion.workout?.dayNumber}`));
}

function averageEffortForWeek(completions: Completion[], weekNumber: number) {
  const weekCompletions = completions.filter((completion) => completion.workout?.week?.weekNumber === weekNumber);
  return weekCompletions.length ? Number(calculateAverageEffort(weekCompletions).toFixed(1)) : 0;
}

function isoDay(value: Date | string) {
  return new Date(value).toISOString().slice(0, 10);
}

function startOfWeek(value: Date) {
  const date = new Date(value);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.getFullYear(), date.getMonth(), diff);
}

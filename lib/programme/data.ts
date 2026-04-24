import { determineCircuitCount } from "./programme";
import type { WorkoutTemplate } from "./types";

export const weekDefinitions = [
  { weekNumber: 1, phase: "BUILD_UP", title: "Build-Up 1", theme: "Learn", objective: "Learn the movement patterns and complete one controlled circuit.", circuitCount: 1 },
  { weekNumber: 2, phase: "BUILD_UP", title: "Build-Up 2", theme: "Build", objective: "Build consistency and complete two controlled circuits.", circuitCount: 2 },
  { weekNumber: 3, phase: "BUILD_UP", title: "Build-Up 3", theme: "Capacity", objective: "Increase work capacity and complete three controlled circuits.", circuitCount: 3 },
  { weekNumber: 4, phase: "MAIN_COURSE", title: "Foundation", theme: "Rhythm", objective: "Establish rhythm and begin the full programme.", mainCourseWeekNumber: 1 },
  { weekNumber: 5, phase: "MAIN_COURSE", title: "Build", theme: "Density", objective: "Build consistency and increase training density.", mainCourseWeekNumber: 2 },
  { weekNumber: 6, phase: "MAIN_COURSE", title: "Push", theme: "Intensity", objective: "Increase intensity while keeping form controlled.", mainCourseWeekNumber: 3 },
  { weekNumber: 7, phase: "MAIN_COURSE", title: "Adapt", theme: "Balance", objective: "Balance harder efforts with recovery and aerobic base.", mainCourseWeekNumber: 4 },
  { weekNumber: 8, phase: "MAIN_COURSE", title: "Peak", theme: "Highest Density", objective: "Complete the highest-density week of the programme.", mainCourseWeekNumber: 5 },
  { weekNumber: 9, phase: "MAIN_COURSE", title: "Finish", theme: "Benchmark", objective: "Complete the final push and benchmark progress.", mainCourseWeekNumber: 6 },
] as const;

const cueMap: Record<string, string[]> = {
  "Dumbbell Thruster": ["Keep chest tall.", "Drive through your heels.", "Press overhead as you stand.", "Keep ribs down."],
  "Bodyweight Squat": ["Sit between your heels.", "Keep knees tracking over toes.", "Brace before each rep."],
  "Push-up": ["Set hands under shoulders.", "Keep a straight line.", "Lower with control."],
  "Mountain Climber": ["Stack shoulders over wrists.", "Drive knees smoothly.", "Keep hips steady."],
  "Reverse Lunge": ["Step back softly.", "Keep front heel grounded.", "Stand tall between reps."],
  "Plank": ["Brace your midline.", "Squeeze glutes.", "Keep neck relaxed."],
};

const safetyCue = "Stop if you feel sharp pain or dizziness.";

function ex(name: string, order: number, workSeconds = 40, restSeconds = 20, rounds = 1) {
  return {
    name,
    order,
    workSeconds,
    restSeconds,
    rounds,
    formCues: cueMap[name] ?? ["Move with control.", "Breathe steadily.", "Keep form sharp."],
    safetyCue,
  };
}

export function workoutTemplatesForWeek(weekNumber: number): WorkoutTemplate[] {
  const circuits = determineCircuitCount(weekNumber);
  const mainRounds = weekNumber >= 6 ? 2 : 1;
  const recoveryDuration = weekNumber <= 3 ? 18 : 22;

  return [
    session(1, "Full-Body HIIT", "Conditioning", 22 + circuits * 4, "High", ["Dumbbells", "Exercise Mat", "Timer"], [
      block("Warm-Up", 1, 4, "warmup", [ex("March in Place", 1), ex("Bodyweight Squat", 2), ex("Arm Circles", 3)]),
      block("Main Circuit", 2, 12 + circuits * 4, "main", [ex("Dumbbell Thruster", 1, 40, 20, mainRounds), ex("Mountain Climber", 2), ex("Push-up", 3), ex("Reverse Lunge", 4)]),
      block("Finisher", 3, 3, "finisher", [ex("High Knees", 1, 30, 15, 2), ex("Plank", 2, 30, 15, 2)]),
      block("Cool-Down", 4, 3, "cooldown", [ex("Hamstring Stretch", 1, 40, 10), ex("Hip Flexor Stretch", 2, 40, 10), ex("Child's Pose", 3, 40, 10)]),
    ]),
    session(2, "Zone 2 Cardio", "Cardio", 25 + weekNumber, "Moderate", ["Walking Route", "Timer"], [
      block("Warm-Up", 1, 4, "warmup", [ex("Easy Walk", 1, 60, 0, 4)]),
      block("Steady Work", 2, 20 + weekNumber, "main", [ex("Incline Walk", 1, 60, 0, 20 + weekNumber)]),
      block("Cool-Down", 3, 4, "cooldown", [ex("Easy Walk", 1, 60, 0, 4)]),
    ]),
    session(3, "Metabolic Strength", "Strength Circuit", 24 + circuits * 4, "High", ["Dumbbells", "Exercise Mat"], [
      block("Warm-Up", 1, 4, "warmup", [ex("Glute Bridge", 1), ex("Dead Bug", 2), ex("Thoracic Rotation", 3)]),
      block("Main Circuit", 2, 14 + circuits * 4, "main", [ex("Goblet Squat", 1), ex("Dumbbell Row", 2), ex("Romanian Deadlift", 3), ex("Plank Shoulder Tap", 4)]),
      block("Finisher", 3, 3, "finisher", [ex("Farmer Carry", 1, 30, 15, 2), ex("Wall Sit", 2, 30, 15, 2)]),
      block("Cool-Down", 4, 3, "cooldown", [ex("Hamstring Stretch", 1), ex("Child's Pose", 2)]),
    ]),
    session(4, "Recovery / Mobility", "Recovery", recoveryDuration, "Low", ["Exercise Mat"], [
      block("Mobility Flow", 1, recoveryDuration, "recovery", [ex("Child's Pose", 1, 60, 0, 3), ex("Hip Flexor Stretch", 2, 60, 0, 3), ex("Thoracic Rotation", 3, 60, 0, 3), ex("Hamstring Stretch", 4, 60, 0, 3)]),
    ]),
    session(5, "Lower-Body HIIT", "Conditioning", 23 + circuits * 4, "High", ["Dumbbells", "Step"], [
      block("Warm-Up", 1, 4, "warmup", [ex("March in Place", 1), ex("Bodyweight Squat", 2)]),
      block("Main Circuit", 2, 15 + circuits * 4, "main", [ex("Split Squat", 1), ex("Kettlebell Swing", 2), ex("Step-up", 3), ex("Bicycle Crunch", 4)]),
      block("Cool-Down", 3, 4, "cooldown", [ex("Hip Flexor Stretch", 1), ex("Hamstring Stretch", 2)]),
    ]),
    session(6, weekNumber <= 3 ? "Optional Walk" : "Upper-Body Strength Circuit", weekNumber <= 3 ? "Cardio" : "Strength Circuit", weekNumber <= 3 ? 20 : 26, "Moderate", weekNumber <= 3 ? ["Walking Route"] : ["Dumbbells", "Exercise Mat"], [
      block("Main Work", 1, weekNumber <= 3 ? 20 : 22, "main", weekNumber <= 3 ? [ex("Incline Walk", 1, 60, 0, 20)] : [ex("Dumbbell Row", 1), ex("Push-up", 2), ex("Bear Crawl", 3), ex("Shoulder Tap", 4)]),
      block("Cool-Down", 2, 4, "cooldown", [ex("Child's Pose", 1), ex("Thoracic Rotation", 2)]),
    ]),
    session(7, "Recovery Check and Weekly Reflection", "Reflection", 12, "Low", ["Journal"], [
      block("Recovery Check", 1, 8, "recovery", [ex("Easy Walk", 1, 60, 0, 4), ex("Child's Pose", 2, 60, 0, 2)]),
      block("Reflection", 2, 4, "cooldown", [ex("Breathing Reset", 1, 60, 0, 4)]),
    ]),
  ];
}

function session(dayNumber: number, title: string, type: string, durationMinutes: number, intensity: string, equipment: string[], blocks: WorkoutTemplate["blocks"]): WorkoutTemplate {
  return {
    dayNumber,
    title,
    type,
    durationMinutes,
    intensity,
    equipment,
    description: "Show up and do the work. Keep form sharp and complete the minimum.",
    blocks,
  };
}

function block(name: string, order: number, durationMinutes: number, blockType: WorkoutTemplate["blocks"][number]["blockType"], exercises: WorkoutTemplate["blocks"][number]["exercises"]) {
  return { name, order, durationMinutes, blockType, exercises };
}

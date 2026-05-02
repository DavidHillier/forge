import { determineCircuitCount } from "./programme";
import type { WorkoutTemplate } from "./types";

export const weekDefinitions = [
  { weekNumber: 1, phase: "BUILD_UP", title: "Build-Up 1", theme: "Learn", objective: "Learn the four dumbbell circuits and complete one controlled circuit.", circuitCount: 1 },
  { weekNumber: 2, phase: "BUILD_UP", title: "Build-Up 2", theme: "Build", objective: "Repeat the same movement patterns and complete two controlled circuits.", circuitCount: 2 },
  { weekNumber: 3, phase: "BUILD_UP", title: "Build-Up 3", theme: "Capacity", objective: "Increase work capacity and complete three controlled circuits.", circuitCount: 3 },
  { weekNumber: 4, phase: "MAIN_COURSE", title: "Foundation", theme: "Article Week 1", objective: "Begin the full Men's Fitness six-week fat-loss plan with four circuits.", circuitCount: 4, mainCourseWeekNumber: 1 },
  { weekNumber: 5, phase: "MAIN_COURSE", title: "Build", theme: "Article Week 2", objective: "Keep four circuits and increase the rep targets.", circuitCount: 4, mainCourseWeekNumber: 2 },
  { weekNumber: 6, phase: "MAIN_COURSE", title: "Push", theme: "Article Week 3", objective: "Move to five total circuits with shorter rest.", circuitCount: 5, mainCourseWeekNumber: 3 },
  { weekNumber: 7, phase: "MAIN_COURSE", title: "Adapt", theme: "Article Week 4", objective: "Keep five circuits and increase the rep targets.", circuitCount: 5, mainCourseWeekNumber: 4 },
  { weekNumber: 8, phase: "MAIN_COURSE", title: "Peak", theme: "Article Week 5", objective: "Move to six total circuits with one-minute rest.", circuitCount: 6, mainCourseWeekNumber: 5 },
  { weekNumber: 9, phase: "MAIN_COURSE", title: "Finish", theme: "Article Week 6", objective: "Complete the final six-circuit high-rep week.", circuitCount: 6, mainCourseWeekNumber: 6 },
] as const;

type ExercisePrescription = {
  name: string;
  target: string;
  rest: number;
};

type CircuitPrescription = {
  title: string;
  exercises: ExercisePrescription[];
};

const safetyCue = "Stop if you feel sharp pain or dizziness.";

const cueMap: Record<string, string[]> = {
  Squat: ["Keep chest up.", "Brace your core.", "Press through your heels.", "Keep knees tracking over toes."],
  "Overhead press": ["Brace before pressing.", "Press straight overhead.", "Keep ribs down.", "Lower under control."],
  "Push-up renegade row": ["Brace hard through the trunk.", "Keep hips as still as possible.", "Alternate rows with control.", "Use lighter dumbbells if form breaks."],
  "Hammer curl": ["Keep elbows close.", "Stand tall.", "Lower slowly.", "Do not swing the weights."],
  "Triceps extension": ["Point elbows up.", "Keep upper arms still.", "Brace your core.", "Move through a controlled range."],
  Lunge: ["Step with control.", "Aim for both knees near 90 degrees.", "Push back from the front foot.", "Alternate sides."],
  "Upright row": ["Lead with elbows.", "Keep weights close.", "Stand tall.", "Lower slowly."],
  "Floor press": ["Set shoulders on the floor.", "Press powerfully.", "Lower with control.", "Keep wrists stacked."],
  "Bent-over row": ["Hinge from the hips.", "Keep back flat.", "Lead with elbows.", "Squeeze shoulder blades."],
  Plank: ["Elbows under shoulders.", "Keep body in one line.", "Brace abs and glutes.", "Breathe steadily."],
  "Goblet squat": ["Hold the dumbbell by your chest.", "Keep torso upright.", "Sit between your heels.", "Drive up with control."],
  "Lateral raise": ["Lead with elbows.", "Raise to shoulder height.", "Keep shoulders down.", "Use a controlled tempo."],
  "Push-up": ["Hands under shoulders.", "Brace core and glutes.", "Lower chest with control.", "Press back powerfully."],
  "One-arm row": ["Support yourself securely.", "Row toward your side.", "Lead with the elbow.", "Control the lowering phase."],
  "Side bend": ["Use one dumbbell only.", "Move slowly.", "Keep hips square.", "Use your side abs to return."],
  "Reverse lunge": ["Step back softly.", "Bend both knees.", "Push through the front foot.", "Alternate sides."],
  Halo: ["Move the dumbbell around the head.", "Keep ribs down.", "Control the weight.", "Alternate directions."],
  "Diamond push-up": ["Make a diamond with thumbs and forefingers.", "Keep elbows close.", "Lower under control.", "Use knees if needed."],
  "Reverse-grip bent-over row": ["Palms face forward.", "Hinge from the hips.", "Row to your sides.", "Lower with control."],
  "Side plank": ["Elbow under shoulder.", "Lift hips high.", "Keep a straight line.", "Repeat both sides."],
};

const articleWeeks: Record<number, CircuitPrescription[]> = {
  1: [
    circuit("Circuit 1", [["Squat", "12", 0], ["Overhead press", "12", 0], ["Push-up renegade row", "6 each side", 0], ["Hammer curl", "12", 0], ["Triceps extension", "12", 120]]),
    circuit("Circuit 2", [["Lunge", "12", 0], ["Upright row", "12", 0], ["Floor press", "12", 0], ["Bent-over row", "12", 0], ["Plank", "30 sec", 120]]),
    circuit("Circuit 3", [["Goblet squat", "12", 0], ["Lateral raise", "12", 0], ["Push-up", "12", 0], ["One-arm row", "8 each side", 0], ["Side bend", "10 each side", 120]]),
    circuit("Circuit 4", [["Reverse lunge", "8 each side", 0], ["Halo", "8 each side", 0], ["Diamond push-up", "8", 0], ["Reverse-grip bent-over row", "12", 0], ["Side plank", "30 sec each side", 120]]),
  ],
  2: [
    circuit("Circuit 1", [["Squat", "15", 0], ["Overhead press", "15", 0], ["Push-up renegade row", "8 each side", 0], ["Hammer curl", "15", 0], ["Triceps extension", "15", 120]]),
    circuit("Circuit 2", [["Lunge", "15", 0], ["Upright row", "15", 0], ["Floor press", "15", 0], ["Bent-over row", "15", 0], ["Plank", "40 sec", 120]]),
    circuit("Circuit 3", [["Goblet squat", "15", 0], ["Lateral raise", "15", 0], ["Push-up", "15", 0], ["One-arm row", "10 each side", 0], ["Side bend", "12 each side", 120]]),
    circuit("Circuit 4", [["Reverse lunge", "10 each side", 0], ["Halo", "10 each side", 0], ["Diamond push-up", "10", 0], ["Reverse-grip bent-over row", "15", 0], ["Side plank", "30 sec each side", 120]]),
  ],
  3: [
    circuit("Circuit 1", [["Squat", "12", 0], ["Overhead press", "12", 0], ["Push-up renegade row", "8 each side", 0], ["Hammer curl", "12", 0], ["Triceps extension", "12", 90]]),
    circuit("Circuit 2", [["Lunge", "12", 0], ["Upright row", "12", 0], ["Floor press", "12", 0], ["Bent-over row", "12", 0], ["Plank", "30 sec", 90]]),
    circuit("Circuit 3", [["Goblet squat", "12", 0], ["Lateral raise", "12", 0], ["Push-up", "12", 0], ["One-arm row", "8 each side", 0], ["Side bend", "10 each side", 90]]),
    circuit("Circuit 4", [["Reverse lunge", "8 each side", 0], ["Halo", "8 each side", 0], ["Diamond push-up", "8", 0], ["Reverse-grip bent-over row", "12", 0], ["Side plank", "30 sec each side", 90]]),
  ],
  4: [
    circuit("Circuit 1", [["Squat", "15", 0], ["Overhead press", "15", 0], ["Push-up renegade row", "10 each side", 0], ["Hammer curl", "15", 0], ["Triceps extension", "15", 90]]),
    circuit("Circuit 2", [["Lunge", "15", 0], ["Upright row", "15", 0], ["Floor press", "15", 0], ["Bent-over row", "15", 0], ["Plank", "40 sec", 90]]),
    circuit("Circuit 3", [["Goblet squat", "15", 0], ["Lateral raise", "15", 0], ["Push-up", "15", 0], ["One-arm row", "10 each side", 0], ["Side bend", "12 each side", 90]]),
    circuit("Circuit 4", [["Reverse lunge", "10 each side", 0], ["Halo", "10 each side", 0], ["Diamond push-up", "10", 0], ["Reverse-grip bent-over row", "15", 0], ["Side plank", "30 sec each side", 90]]),
  ],
  5: [
    circuit("Circuit 1", [["Squat", "12", 0], ["Overhead press", "12", 0], ["Push-up renegade row", "8 each side", 0], ["Hammer curl", "12", 0], ["Triceps extension", "12", 60]]),
    circuit("Circuit 2", [["Lunge", "12", 0], ["Upright row", "12", 0], ["Floor press", "12", 0], ["Bent-over row", "12", 0], ["Plank", "30 sec", 60]]),
    circuit("Circuit 3", [["Goblet squat", "12", 0], ["Lateral raise", "12", 0], ["Push-up", "12", 0], ["One-arm row", "8 each side", 0], ["Side bend", "10 each side", 60]]),
    circuit("Circuit 4", [["Reverse lunge", "8 each side", 0], ["Halo", "8 each side", 0], ["Diamond push-up", "8", 0], ["Reverse-grip bent-over row", "12", 0], ["Side plank", "30 sec each side", 60]]),
  ],
  6: [
    circuit("Circuit 1", [["Squat", "15", 0], ["Overhead press", "15", 0], ["Push-up renegade row", "10 each side", 0], ["Hammer curl", "15", 0], ["Triceps extension", "15", 60]]),
    circuit("Circuit 2", [["Lunge", "15", 0], ["Upright row", "15", 0], ["Floor press", "15", 0], ["Bent-over row", "15", 0], ["Plank", "50 sec", 60]]),
    circuit("Circuit 3", [["Goblet squat", "15", 0], ["Lateral raise", "15", 0], ["Push-up", "15", 0], ["One-arm row", "10 each side", 0], ["Side bend", "12 each side", 60]]),
    circuit("Circuit 4", [["Reverse lunge", "10 each side", 0], ["Halo", "10 each side", 0], ["Diamond push-up", "10", 0], ["Reverse-grip bent-over row", "15", 0], ["Side plank", "30 sec each side", 60]]),
  ],
};

export function workoutTemplatesForWeek(weekNumber: number): WorkoutTemplate[] {
  const circuits = determineCircuitCount(weekNumber);
  const articleWeek = Math.min(Math.max(weekNumber - 3, 1), 6);
  const circuitWorkouts = articleWeeks[articleWeek];

  return [
    circuitSession(1, circuitWorkouts[0], circuits, articleWeek),
    recoverySession(2, "Walk / Easy Cardio", 25, "Walk briskly or use easy cardio to build your aerobic base without adding fatigue."),
    circuitSession(3, circuitWorkouts[1], circuits, articleWeek),
    recoverySession(4, "Mobility / Recovery", 18, "Move deliberately, open the hips and shoulders, and keep effort low."),
    circuitSession(5, circuitWorkouts[2], circuits, articleWeek),
    circuitSession(6, circuitWorkouts[3], circuits, articleWeek),
    recoverySession(7, "Recovery Check and Weekly Reflection", 12, "Review the week, note recovery, and prepare for the next progression."),
  ];
}

function circuit(title: string, items: [string, string, number][]): CircuitPrescription {
  return {
    title,
    exercises: items.map(([name, target, rest]) => ({ name, target, rest })),
  };
}

function circuitSession(dayNumber: number, prescription: CircuitPrescription, circuits: number, articleWeek: number): WorkoutTemplate {
  const durationMinutes = Math.round(5 + circuits * estimateCircuitMinutes(prescription));

  return session(
    dayNumber,
    `${prescription.title}: Dumbbell Fat-Loss Circuit`,
    "Dumbbell Circuit",
    durationMinutes,
    circuits >= 5 ? "High" : "Moderate-High",
    ["Dumbbells", "Exercise Mat", "Timer"],
    `Complete ${circuits} circuit${circuits === 1 ? "" : "s"}. This maps to article week ${articleWeek} of the six-week Men's Fitness fat-loss plan.`,
    [
      block("Warm-Up", 1, 4, "warmup", [
        ex("March in place", "60 sec", 1, 60, 0),
        ex("Bodyweight squat", "60 sec", 2, 60, 0),
        ex("Arm circles", "60 sec", 3, 60, 0),
      ]),
      block(
        prescription.title,
        2,
        Math.max(10, durationMinutes - 7),
        "main",
        prescription.exercises.map((exercise, index) =>
          ex(exercise.name, exercise.target, index + 1, secondsForTarget(exercise.target), exercise.rest),
        ),
      ),
      block("Cool-Down", 3, 3, "cooldown", [
        ex("Hamstring stretch", "45 sec", 1, 45, 0),
        ex("Hip flexor stretch", "45 sec each side", 2, 90, 0),
        ex("Child's pose", "45 sec", 3, 45, 0),
      ]),
    ],
  );
}

function recoverySession(dayNumber: number, title: string, durationMinutes: number, description: string): WorkoutTemplate {
  return session(dayNumber, title, "Recovery", durationMinutes, "Low", ["Comfortable shoes", "Exercise Mat"], description, [
    block("Recovery Work", 1, durationMinutes, "recovery", [
      ex(title.includes("Walk") ? "Easy walk" : "Breathing reset", `${durationMinutes} min`, 1, durationMinutes * 60, 0),
    ]),
  ]);
}

function session(
  dayNumber: number,
  title: string,
  type: string,
  durationMinutes: number,
  intensity: string,
  equipment: string[],
  description: string,
  blocks: WorkoutTemplate["blocks"],
): WorkoutTemplate {
  return {
    dayNumber,
    title,
    type,
    durationMinutes,
    intensity,
    equipment,
    description,
    blocks,
  };
}

function block(
  name: string,
  order: number,
  durationMinutes: number,
  blockType: WorkoutTemplate["blocks"][number]["blockType"],
  exercises: WorkoutTemplate["blocks"][number]["exercises"],
) {
  return { name, order, durationMinutes, blockType, exercises };
}

function ex(name: string, target: string, order: number, workSeconds: number, restSeconds: number) {
  return {
    name: `${name} (${target})`,
    order,
    workSeconds,
    restSeconds,
    rounds: 1,
    formCues: [`Target: ${target}.`, ...(cueMap[name] ?? ["Move with control.", "Breathe steadily.", "Keep form sharp."])],
    safetyCue,
  };
}

function secondsForTarget(target: string) {
  const firstNumber = Number(target.match(/\d+/)?.[0] ?? 10);
  if (target.includes("sec")) return target.includes("each side") ? firstNumber * 2 : firstNumber;
  if (target.includes("each side")) return firstNumber * 6;
  return firstNumber * 3;
}

function estimateCircuitMinutes(prescription: CircuitPrescription) {
  const seconds = prescription.exercises.reduce((sum, exercise) => sum + secondsForTarget(exercise.target) + exercise.rest, 0);
  return seconds / 60;
}

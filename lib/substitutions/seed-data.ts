import type { SubstitutionReason, Difficulty, ImpactLevel, MatchQuality } from "./types";

type ExDef = {
  name: string;
  movementPattern: string;
  primaryMuscles: string[];
  secondaryMuscles?: string[];
  equipment: string[];
  difficulty: Difficulty;
  impactLevel: ImpactLevel;
  jointStressLevel: ImpactLevel;
  formCues: string[];
  safetyCue?: string;
};

type SubDef = ExDef & {
  substitutionReasons: SubstitutionReason[];
  matchQuality: MatchQuality;
  intensityChange: "lower" | "same" | "higher";
  difficultyChange: "easier" | "same" | "harder";
  recommendationRank: number;
  scalingNote?: string;
  cautionNote?: string;
  isAdvanced?: boolean;
};

export type CanonicalDef = ExDef & {
  isCanonical: true;
  substitutes: SubDef[];
};

const DEFAULT_SAFETY = "Stop if you feel sharp pain or dizziness.";

export const canonicalExercises: CanonicalDef[] = [
  // ─── 1. Dumbbell squat ────────────────────────────────────────────────────
  {
    name: "Dumbbell squat",
    movementPattern: "Bilateral knee-dominant squat",
    primaryMuscles: ["quads", "glutes", "hamstrings", "trunk"],
    equipment: ["Dumbbells"],
    difficulty: "moderate",
    impactLevel: "moderate",
    jointStressLevel: "moderate",
    isCanonical: true,
    formCues: ["Keep chest up and brace your core.", "Press through your heels.", "Keep knees tracking over toes.", "Lower until thighs are near parallel."],
    substitutes: [
      { name: "Barbell back squat", movementPattern: "Bilateral knee-dominant squat", primaryMuscles: ["quads","glutes","hamstrings"], equipment: ["Barbell"], difficulty: "moderate", impactLevel: "moderate", jointStressLevel: "moderate", formCues: ["Bar sits on upper traps.", "Brace hard before descent.", "Drive knees out."], substitutionReasons: ["heavier_strength","closest_match"], matchQuality: "excellent", intensityChange: "higher", difficultyChange: "same", recommendationRank: 1 },
      { name: "Kettlebell goblet squat", movementPattern: "Bilateral knee-dominant squat", primaryMuscles: ["quads","glutes","upper back"], equipment: ["Kettlebells"], difficulty: "beginner", impactLevel: "low", jointStressLevel: "low", formCues: ["Hold kettlebell by horns at chest.", "Sit tall between your heels.", "Drive elbows between knees."], substitutionReasons: ["closest_match","easier","joint_friendly","equipment_unavailable"], matchQuality: "excellent", intensityChange: "lower", difficultyChange: "easier", recommendationRank: 2 },
      { name: "Bodyweight squat", movementPattern: "Bilateral knee-dominant squat", primaryMuscles: ["quads","glutes","hamstrings"], equipment: ["Bodyweight"], difficulty: "beginner", impactLevel: "low", jointStressLevel: "low", formCues: ["Arms forward for balance.", "Sit back and down.", "Stand tall at the top."], substitutionReasons: ["no_equipment","bodyweight","easier","joint_friendly"], matchQuality: "good", intensityChange: "lower", difficultyChange: "easier", recommendationRank: 3, scalingNote: "Increase reps to maintain training stimulus." },
      { name: "Jump squat", movementPattern: "Bilateral knee-dominant squat", primaryMuscles: ["quads","glutes","calves"], equipment: ["Bodyweight"], difficulty: "moderate", impactLevel: "high", jointStressLevel: "moderate", formCues: ["Explode from the bottom.", "Land softly with bent knees.", "Reset before next rep."], substitutionReasons: ["conditioning","bodyweight","no_equipment"], matchQuality: "good", intensityChange: "higher", difficultyChange: "same", recommendationRank: 4, cautionNote: "Avoid on hard surfaces. High knee impact." },
      { name: "Bulgarian split squat", movementPattern: "Unilateral knee-dominant squat", primaryMuscles: ["quads","glutes","hamstrings"], equipment: ["Dumbbells","Bodyweight"], difficulty: "moderate", impactLevel: "moderate", jointStressLevel: "moderate", formCues: ["Rear foot elevated on bench.", "Front shin stays vertical.", "Lower rear knee toward floor."], substitutionReasons: ["harder","heavier_strength"], matchQuality: "good", intensityChange: "higher", difficultyChange: "harder", recommendationRank: 5, scalingNote: "Use bodyweight first to find balance." },
      { name: "Barbell front squat", movementPattern: "Bilateral knee-dominant squat", primaryMuscles: ["quads","glutes","upper back"], equipment: ["Barbell"], difficulty: "advanced", impactLevel: "moderate", jointStressLevel: "moderate", formCues: ["Bar rests on front delts.", "Elbows high.", "Upright torso throughout."], substitutionReasons: ["heavier_strength","harder"], matchQuality: "good", intensityChange: "higher", difficultyChange: "harder", recommendationRank: 6, isAdvanced: true, cautionNote: "Use only if confident with the rack position." },
      { name: "Pistol squat", movementPattern: "Unilateral knee-dominant squat", primaryMuscles: ["quads","glutes","hamstrings"], equipment: ["Bodyweight"], difficulty: "advanced", impactLevel: "moderate", jointStressLevel: "high", formCues: ["One leg extended forward.", "Lower on control.", "Use a wall for balance if needed."], substitutionReasons: ["harder","bodyweight","no_equipment"], matchQuality: "good", intensityChange: "higher", difficultyChange: "harder", recommendationRank: 7, isAdvanced: true, cautionNote: "High knee stress. Only for confident movers." },
      { name: "Static split squat", movementPattern: "Unilateral knee-dominant squat", primaryMuscles: ["quads","glutes"], equipment: ["Bodyweight","Dumbbells"], difficulty: "beginner", impactLevel: "low", jointStressLevel: "low", formCues: ["Stationary lunge stance.", "Lower rear knee toward floor.", "Push back to start."], substitutionReasons: ["easier","joint_friendly","bodyweight"], matchQuality: "good", intensityChange: "lower", difficultyChange: "easier", recommendationRank: 8 },
      { name: "Dumbbell step-up", movementPattern: "Unilateral knee-dominant", primaryMuscles: ["quads","glutes"], equipment: ["Dumbbells"], difficulty: "beginner", impactLevel: "low", jointStressLevel: "low", formCues: ["Step onto a stable surface.", "Drive through the front heel.", "Lower with control."], substitutionReasons: ["easier","joint_friendly"], matchQuality: "fair", intensityChange: "lower", difficultyChange: "easier", recommendationRank: 9 },
      { name: "Barbell Zercher squat", movementPattern: "Bilateral knee-dominant squat", primaryMuscles: ["quads","glutes","upper back"], equipment: ["Barbell"], difficulty: "advanced", impactLevel: "moderate", jointStressLevel: "moderate", formCues: ["Bar held in crook of elbows.", "Stay upright.", "Brace hard."], substitutionReasons: ["heavier_strength"], matchQuality: "good", intensityChange: "higher", difficultyChange: "harder", recommendationRank: 10, isAdvanced: true },
    ],
  },

  // ─── 2. Dumbbell overhead press ───────────────────────────────────────────
  {
    name: "Dumbbell overhead press",
    movementPattern: "Vertical push",
    primaryMuscles: ["anterior deltoids", "medial deltoids", "triceps", "upper chest"],
    equipment: ["Dumbbells"],
    difficulty: "moderate",
    impactLevel: "low",
    jointStressLevel: "moderate",
    isCanonical: true,
    formCues: ["Brace core before pressing.", "Press straight overhead.", "Keep ribs down.", "Lower under full control."],
    substitutes: [
      { name: "Pike push-up", movementPattern: "Vertical push", primaryMuscles: ["anterior deltoids","triceps"], equipment: ["Bodyweight"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "moderate", formCues: ["Hips high in inverted V.", "Lower crown toward floor.", "Press back up powerfully."], substitutionReasons: ["no_equipment","bodyweight","closest_match"], matchQuality: "good", intensityChange: "lower", difficultyChange: "easier", recommendationRank: 1, scalingNote: "Elevate feet to increase difficulty." },
      { name: "Barbell standing overhead press", movementPattern: "Vertical push", primaryMuscles: ["deltoids","triceps","upper chest"], equipment: ["Barbell"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "moderate", formCues: ["Grip slightly wider than shoulders.", "Press bar straight up.", "Lock out at top."], substitutionReasons: ["heavier_strength","closest_match"], matchQuality: "excellent", intensityChange: "higher", difficultyChange: "same", recommendationRank: 2 },
      { name: "Kettlebell single-arm press", movementPattern: "Vertical push", primaryMuscles: ["deltoids","triceps","trunk"], equipment: ["Kettlebells"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "moderate", formCues: ["Stack wrist over elbow over shoulder.", "Brace hard.", "Press vertically."], substitutionReasons: ["equipment_unavailable","conditioning","closest_match"], matchQuality: "excellent", intensityChange: "same", difficultyChange: "same", recommendationRank: 3 },
      { name: "Dumbbell Arnold press", movementPattern: "Vertical push", primaryMuscles: ["deltoids","triceps"], equipment: ["Dumbbells"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "moderate", formCues: ["Start palms facing you.", "Rotate as you press.", "Full rotation at top."], substitutionReasons: ["closest_match","harder"], matchQuality: "excellent", intensityChange: "same", difficultyChange: "same", recommendationRank: 4 },
      { name: "Kettlebell bottoms-up press", movementPattern: "Vertical push", primaryMuscles: ["deltoids","triceps","grip"], equipment: ["Kettlebells"], difficulty: "advanced", impactLevel: "low", jointStressLevel: "moderate", formCues: ["Grip tight.", "Keep wrist straight.", "Press slowly with full control."], substitutionReasons: ["harder","conditioning"], matchQuality: "good", intensityChange: "same", difficultyChange: "harder", recommendationRank: 5, isAdvanced: true, cautionNote: "Use only if confident with kettlebell control." },
      { name: "Handstand push-up against wall", movementPattern: "Vertical push", primaryMuscles: ["deltoids","triceps","upper chest"], equipment: ["Bodyweight"], difficulty: "advanced", impactLevel: "moderate", jointStressLevel: "high", formCues: ["Kick up with control.", "Lower slowly.", "Press through full range."], substitutionReasons: ["harder","bodyweight","no_equipment"], matchQuality: "good", intensityChange: "higher", difficultyChange: "harder", recommendationRank: 6, isAdvanced: true, cautionNote: "Use only if confident inverted. High shoulder stress." },
      { name: "Barbell push press", movementPattern: "Vertical push with leg drive", primaryMuscles: ["deltoids","triceps","legs"], equipment: ["Barbell"], difficulty: "advanced", impactLevel: "moderate", jointStressLevel: "moderate", formCues: ["Dip slightly at knees.", "Drive hips to initiate.", "Lock out overhead."], substitutionReasons: ["heavier_strength","conditioning","harder"], matchQuality: "good", intensityChange: "higher", difficultyChange: "harder", recommendationRank: 7, isAdvanced: true },
      { name: "Cable overhead press", movementPattern: "Vertical push", primaryMuscles: ["deltoids","triceps"], equipment: ["Cable machine"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "low", formCues: ["Set pulleys low.", "Press overhead.", "Maintain tension throughout."], substitutionReasons: ["joint_friendly","equipment_unavailable"], matchQuality: "good", intensityChange: "same", difficultyChange: "easier", recommendationRank: 8 },
      { name: "Seated barbell press", movementPattern: "Vertical push", primaryMuscles: ["deltoids","triceps","upper chest"], equipment: ["Barbell"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "moderate", formCues: ["Sit tall on bench.", "Press from chin height.", "Control the descent."], substitutionReasons: ["heavier_strength"], matchQuality: "excellent", intensityChange: "higher", difficultyChange: "same", recommendationRank: 9 },
      { name: "Kettlebell double press", movementPattern: "Vertical push", primaryMuscles: ["deltoids","triceps","trunk"], equipment: ["Kettlebells"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "moderate", formCues: ["Press both at once.", "Brace the entire trunk.", "Lower under control."], substitutionReasons: ["heavier_strength","conditioning"], matchQuality: "good", intensityChange: "higher", difficultyChange: "harder", recommendationRank: 10 },
    ],
  },

  // ─── 3. Push-up renegade row ───────────────────────────────────────────────
  {
    name: "Push-up renegade row",
    movementPattern: "Compound anti-rotation push-pull",
    primaryMuscles: ["chest", "lats", "rhomboids", "triceps", "trunk"],
    equipment: ["Dumbbells"],
    difficulty: "moderate",
    impactLevel: "low",
    jointStressLevel: "moderate",
    isCanonical: true,
    formCues: ["Brace hard through the trunk.", "Keep hips square — don't rotate.", "Alternate rows under control.", "Use lighter dumbbells if form breaks."],
    substitutes: [
      { name: "Kettlebell renegade row", movementPattern: "Anti-rotation push-pull", primaryMuscles: ["chest","lats","trunk"], equipment: ["Kettlebells"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "moderate", formCues: ["Flat handles aid stability.", "Keep hips level.", "Row to the side of your torso."], substitutionReasons: ["closest_match","equipment_unavailable"], matchQuality: "excellent", intensityChange: "same", difficultyChange: "same", recommendationRank: 1 },
      { name: "Plank row", movementPattern: "Anti-rotation pull", primaryMuscles: ["lats","rhomboids","trunk"], equipment: ["Dumbbells"], difficulty: "beginner", impactLevel: "low", jointStressLevel: "low", formCues: ["Hold plank.", "Row one arm.", "Keep hips still."], substitutionReasons: ["easier","joint_friendly","bodyweight"], matchQuality: "good", intensityChange: "lower", difficultyChange: "easier", recommendationRank: 2 },
      { name: "Push-up to single-arm row", movementPattern: "Anti-rotation push-pull", primaryMuscles: ["chest","lats","trunk"], equipment: ["Dumbbells"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "moderate", formCues: ["Do push-up first.", "Then row one side.", "Alternate rows each rep."], substitutionReasons: ["closest_match"], matchQuality: "excellent", intensityChange: "same", difficultyChange: "same", recommendationRank: 3 },
      { name: "Plank with dumbbell pull-through", movementPattern: "Anti-rotation", primaryMuscles: ["trunk","shoulders"], equipment: ["Dumbbells"], difficulty: "beginner", impactLevel: "low", jointStressLevel: "low", formCues: ["Hold plank.", "Reach under and pull dumbbell through.", "Keep hips still."], substitutionReasons: ["easier","joint_friendly"], matchQuality: "fair", intensityChange: "lower", difficultyChange: "easier", recommendationRank: 4 },
      { name: "Spider-man push-up", movementPattern: "Anti-rotation horizontal push", primaryMuscles: ["chest","hip flexors","trunk"], equipment: ["Bodyweight"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "moderate", formCues: ["Bring knee to elbow as you lower.", "Press back up.", "Alternate sides."], substitutionReasons: ["no_equipment","bodyweight","conditioning"], matchQuality: "fair", intensityChange: "same", difficultyChange: "same", recommendationRank: 5 },
      { name: "Archer push-up", movementPattern: "Unilateral horizontal push", primaryMuscles: ["chest","triceps","trunk"], equipment: ["Bodyweight"], difficulty: "advanced", impactLevel: "low", jointStressLevel: "moderate", formCues: ["Wide stance.", "Shift weight to one arm.", "Lower toward loaded arm."], substitutionReasons: ["harder","bodyweight","no_equipment"], matchQuality: "fair", intensityChange: "higher", difficultyChange: "harder", recommendationRank: 6, isAdvanced: true },
      { name: "Kettlebell bottoms-up plank row", movementPattern: "Anti-rotation pull", primaryMuscles: ["lats","trunk","grip"], equipment: ["Kettlebells"], difficulty: "advanced", impactLevel: "low", jointStressLevel: "moderate", formCues: ["Keep kettlebell inverted.", "Row slowly with full control.", "Don't rotate hips."], substitutionReasons: ["harder","conditioning"], matchQuality: "good", intensityChange: "higher", difficultyChange: "harder", recommendationRank: 7, isAdvanced: true },
      { name: "Bear crawl with single-arm reach", movementPattern: "Anti-rotation locomotion", primaryMuscles: ["trunk","shoulders","hips"], equipment: ["Bodyweight"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "low", formCues: ["Knees hover off floor.", "Reach one arm forward.", "Keep hips level."], substitutionReasons: ["no_equipment","bodyweight","conditioning"], matchQuality: "fair", intensityChange: "same", difficultyChange: "same", recommendationRank: 8 },
      { name: "Inverted row plus push-up superset", movementPattern: "Horizontal push-pull", primaryMuscles: ["chest","lats","rhomboids"], equipment: ["Pull-up bar"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "low", formCues: ["Do one inverted row, then one push-up.", "Keep body rigid throughout.", "Control both movements."], substitutionReasons: ["equipment_unavailable","closest_match"], matchQuality: "good", intensityChange: "same", difficultyChange: "same", recommendationRank: 9 },
    ],
  },

  // ─── 5. Dumbbell hammer curl ──────────────────────────────────────────────
  {
    name: "Dumbbell hammer curl",
    movementPattern: "Neutral-grip elbow flexion",
    primaryMuscles: ["brachialis", "brachioradialis", "biceps", "forearms"],
    equipment: ["Dumbbells"],
    difficulty: "beginner",
    impactLevel: "low",
    jointStressLevel: "low",
    isCanonical: true,
    formCues: ["Keep elbows close to your sides.", "Stand tall.", "Lower slowly on a 3-count.", "Do not swing the weights."],
    substitutes: [
      { name: "Dumbbell cross-body hammer curl", movementPattern: "Neutral-grip elbow flexion", primaryMuscles: ["brachialis","brachioradialis","biceps"], equipment: ["Dumbbells"], difficulty: "beginner", impactLevel: "low", jointStressLevel: "low", formCues: ["Curl across the body.", "Keep elbow close.", "Alternate arms."], substitutionReasons: ["closest_match"], matchQuality: "excellent", intensityChange: "same", difficultyChange: "same", recommendationRank: 1 },
      { name: "Neutral-grip chin-up", movementPattern: "Vertical pull with neutral grip", primaryMuscles: ["brachialis","biceps","lats"], equipment: ["Pull-up bar"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "low", formCues: ["Palms face each other.", "Lead with elbows.", "Lower fully."], substitutionReasons: ["harder","heavier_strength","conditioning"], matchQuality: "good", intensityChange: "higher", difficultyChange: "harder", recommendationRank: 2 },
      { name: "Dumbbell Zottman curl", movementPattern: "Elbow flexion with rotation", primaryMuscles: ["biceps","brachialis","brachioradialis"], equipment: ["Dumbbells"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "low", formCues: ["Curl up with supinated grip.", "Rotate to neutral at top.", "Lower with neutral grip."], substitutionReasons: ["harder","closest_match"], matchQuality: "good", intensityChange: "same", difficultyChange: "harder", recommendationRank: 3 },
      { name: "Barbell reverse curl", movementPattern: "Pronated elbow flexion", primaryMuscles: ["brachioradialis","brachialis","forearms"], equipment: ["Barbell"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "low", formCues: ["Overhand grip.", "Curl without swinging.", "Control the descent."], substitutionReasons: ["heavier_strength","equipment_unavailable"], matchQuality: "good", intensityChange: "higher", difficultyChange: "same", recommendationRank: 4 },
      { name: "Cable rope hammer curl", movementPattern: "Neutral-grip elbow flexion", primaryMuscles: ["brachialis","brachioradialis"], equipment: ["Cable machine"], difficulty: "beginner", impactLevel: "low", jointStressLevel: "low", formCues: ["Keep elbows fixed.", "Curl rope apart at top.", "Lower slowly."], substitutionReasons: ["equipment_unavailable","joint_friendly"], matchQuality: "excellent", intensityChange: "same", difficultyChange: "easier", recommendationRank: 5 },
      { name: "Kettlebell hammer curl", movementPattern: "Neutral-grip elbow flexion", primaryMuscles: ["brachialis","brachioradialis"], equipment: ["Kettlebells"], difficulty: "beginner", impactLevel: "low", jointStressLevel: "low", formCues: ["Hold by the horn.", "Curl without swinging.", "Lower controlled."], substitutionReasons: ["equipment_unavailable","closest_match"], matchQuality: "excellent", intensityChange: "same", difficultyChange: "same", recommendationRank: 6 },
      { name: "Towel chin-up", movementPattern: "Vertical pull with grip challenge", primaryMuscles: ["brachialis","brachioradialis","lats","grip"], equipment: ["Pull-up bar"], difficulty: "advanced", impactLevel: "low", jointStressLevel: "moderate", formCues: ["Loop towels over bar.", "Grip tightly.", "Pull until elbows are 90 degrees."], substitutionReasons: ["harder","conditioning"], matchQuality: "fair", intensityChange: "higher", difficultyChange: "harder", recommendationRank: 7, isAdvanced: true },
      { name: "Incline dumbbell hammer curl", movementPattern: "Neutral-grip elbow flexion", primaryMuscles: ["brachialis","biceps long head"], equipment: ["Dumbbells"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "low", formCues: ["Lie on incline bench.", "Arms hang fully extended.", "Curl under strict control."], substitutionReasons: ["harder","heavier_strength"], matchQuality: "good", intensityChange: "same", difficultyChange: "harder", recommendationRank: 8 },
    ],
  },

  // ─── 6. Dumbbell triceps extension ────────────────────────────────────────
  {
    name: "Dumbbell triceps extension",
    movementPattern: "Elbow extension with overhead emphasis",
    primaryMuscles: ["triceps long head", "triceps"],
    equipment: ["Dumbbells"],
    difficulty: "beginner",
    impactLevel: "low",
    jointStressLevel: "moderate",
    isCanonical: true,
    formCues: ["Point elbows to the ceiling.", "Keep upper arms still.", "Brace your core.", "Move through a full, controlled range."],
    substitutes: [
      { name: "Close-grip push-up", movementPattern: "Narrow horizontal push", primaryMuscles: ["triceps","chest"], equipment: ["Bodyweight"], difficulty: "beginner", impactLevel: "low", jointStressLevel: "low", formCues: ["Hands narrow, inside shoulder width.", "Elbows brush your sides.", "Lower slowly."], substitutionReasons: ["no_equipment","bodyweight","easier","joint_friendly"], matchQuality: "good", intensityChange: "lower", difficultyChange: "easier", recommendationRank: 1 },
      { name: "Cable pressdown", movementPattern: "Elbow extension", primaryMuscles: ["triceps"], equipment: ["Cable machine"], difficulty: "beginner", impactLevel: "low", jointStressLevel: "low", formCues: ["Keep elbows fixed.", "Press down fully.", "Control return."], substitutionReasons: ["joint_friendly","equipment_unavailable","easier"], matchQuality: "good", intensityChange: "same", difficultyChange: "easier", recommendationRank: 2 },
      { name: "Parallel bar dips", movementPattern: "Vertical push", primaryMuscles: ["triceps","chest","anterior deltoid"], equipment: ["Chin-up and dip station"], difficulty: "moderate", impactLevel: "moderate", jointStressLevel: "moderate", formCues: ["Stay upright for tricep bias.", "Lower until elbows are 90 degrees.", "Press up fully."], substitutionReasons: ["heavier_strength","harder","conditioning"], matchQuality: "good", intensityChange: "higher", difficultyChange: "harder", recommendationRank: 3, cautionNote: "Shoulder stress if going too deep. Control depth." },
      { name: "Kettlebell overhead extension", movementPattern: "Elbow extension with overhead emphasis", primaryMuscles: ["triceps long head","triceps"], equipment: ["Kettlebells"], difficulty: "beginner", impactLevel: "low", jointStressLevel: "moderate", formCues: ["Hold kettlebell by the bell.", "Point elbows up.", "Extend fully."], substitutionReasons: ["closest_match","equipment_unavailable"], matchQuality: "excellent", intensityChange: "same", difficultyChange: "same", recommendationRank: 4 },
      { name: "Cable rope overhead triceps extension", movementPattern: "Elbow extension overhead", primaryMuscles: ["triceps long head"], equipment: ["Cable machine"], difficulty: "beginner", impactLevel: "low", jointStressLevel: "low", formCues: ["Face away from stack.", "Press rope apart at end.", "Full extension."], substitutionReasons: ["equipment_unavailable","joint_friendly"], matchQuality: "excellent", intensityChange: "same", difficultyChange: "same", recommendationRank: 5 },
      { name: "Barbell skull crusher", movementPattern: "Elbow extension", primaryMuscles: ["triceps"], equipment: ["Barbell"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "moderate", formCues: ["Lower bar to forehead.", "Keep upper arms vertical.", "Press back up."], substitutionReasons: ["heavier_strength"], matchQuality: "good", intensityChange: "higher", difficultyChange: "same", recommendationRank: 6 },
      { name: "Barbell close-grip bench press", movementPattern: "Horizontal push tricep emphasis", primaryMuscles: ["triceps","chest"], equipment: ["Barbell"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "moderate", formCues: ["Grip shoulder-width or closer.", "Elbows at 45 degrees.", "Full range of motion."], substitutionReasons: ["heavier_strength"], matchQuality: "good", intensityChange: "higher", difficultyChange: "same", recommendationRank: 7 },
      { name: "Bench dip loaded with dumbbell", movementPattern: "Elbow extension", primaryMuscles: ["triceps","anterior deltoid"], equipment: ["Dumbbells"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "moderate", formCues: ["Feet on floor or elevated.", "Place dumbbell on thighs.", "Dip with control."], substitutionReasons: ["harder","heavier_strength"], matchQuality: "good", intensityChange: "higher", difficultyChange: "harder", recommendationRank: 8, cautionNote: "Significant shoulder stress at depth." },
      { name: "Barbell JM press", movementPattern: "Hybrid elbow extension", primaryMuscles: ["triceps"], equipment: ["Barbell"], difficulty: "advanced", impactLevel: "low", jointStressLevel: "moderate", formCues: ["Part close-grip press, part skull crusher.", "Bar travels to chin area.", "Press back up."], substitutionReasons: ["heavier_strength","harder"], matchQuality: "good", intensityChange: "higher", difficultyChange: "harder", recommendationRank: 9, isAdvanced: true },
    ],
  },

  // ─── 7. Dumbbell lunge ────────────────────────────────────────────────────
  {
    name: "Dumbbell lunge",
    movementPattern: "Unilateral knee-dominant forward step",
    primaryMuscles: ["quads", "glutes", "hamstrings", "trunk"],
    equipment: ["Dumbbells"],
    difficulty: "moderate",
    impactLevel: "moderate",
    jointStressLevel: "moderate",
    isCanonical: true,
    formCues: ["Step forward with control.", "Both knees to 90 degrees.", "Push back from the front foot.", "Keep torso upright."],
    substitutes: [
      { name: "Bodyweight lunge", movementPattern: "Unilateral knee-dominant forward step", primaryMuscles: ["quads","glutes","hamstrings"], equipment: ["Bodyweight"], difficulty: "beginner", impactLevel: "moderate", jointStressLevel: "moderate", formCues: ["Step with control.", "Lower back knee toward floor.", "Push back from front foot."], substitutionReasons: ["no_equipment","bodyweight","easier"], matchQuality: "good", intensityChange: "lower", difficultyChange: "easier", recommendationRank: 1 },
      { name: "Barbell walking lunge", movementPattern: "Unilateral knee-dominant forward step", primaryMuscles: ["quads","glutes","hamstrings"], equipment: ["Barbell"], difficulty: "moderate", impactLevel: "moderate", jointStressLevel: "moderate", formCues: ["Bar on upper back.", "Step forward continuously.", "Stay upright."], substitutionReasons: ["heavier_strength","conditioning"], matchQuality: "excellent", intensityChange: "higher", difficultyChange: "same", recommendationRank: 2 },
      { name: "Static split squat", movementPattern: "Unilateral knee-dominant squat", primaryMuscles: ["quads","glutes"], equipment: ["Bodyweight","Dumbbells"], difficulty: "beginner", impactLevel: "low", jointStressLevel: "low", formCues: ["Stationary stance.", "Lower rear knee.", "Push from front foot."], substitutionReasons: ["easier","joint_friendly"], matchQuality: "good", intensityChange: "lower", difficultyChange: "easier", recommendationRank: 3 },
      { name: "Jump lunge", movementPattern: "Plyometric unilateral squat", primaryMuscles: ["quads","glutes","calves"], equipment: ["Bodyweight"], difficulty: "moderate", impactLevel: "high", jointStressLevel: "high", formCues: ["Explode from lunge.", "Switch legs in air.", "Land softly."], substitutionReasons: ["conditioning","bodyweight","harder"], matchQuality: "good", intensityChange: "higher", difficultyChange: "harder", recommendationRank: 4, cautionNote: "High impact. Avoid with knee problems." },
      { name: "Kettlebell goblet lunge", movementPattern: "Unilateral knee-dominant forward step", primaryMuscles: ["quads","glutes","upper back"], equipment: ["Kettlebells"], difficulty: "moderate", impactLevel: "moderate", jointStressLevel: "moderate", formCues: ["Hold kettlebell at chest.", "Step with control.", "Stay tall."], substitutionReasons: ["equipment_unavailable","closest_match"], matchQuality: "excellent", intensityChange: "same", difficultyChange: "same", recommendationRank: 5 },
      { name: "Cossack squat", movementPattern: "Lateral squat", primaryMuscles: ["quads","glutes","adductors"], equipment: ["Bodyweight","Dumbbells"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "moderate", formCues: ["Wide stance.", "Shift weight to one side.", "Opposite leg straight."], substitutionReasons: ["harder","joint_friendly"], matchQuality: "fair", intensityChange: "same", difficultyChange: "harder", recommendationRank: 6, cautionNote: "Requires hip mobility. Move slowly." },
      { name: "Dumbbell step-up", movementPattern: "Unilateral knee-dominant", primaryMuscles: ["quads","glutes"], equipment: ["Dumbbells"], difficulty: "beginner", impactLevel: "low", jointStressLevel: "low", formCues: ["Step onto a stable surface.", "Drive through the front heel.", "Lower with control."], substitutionReasons: ["easier","joint_friendly"], matchQuality: "fair", intensityChange: "lower", difficultyChange: "easier", recommendationRank: 7 },
      { name: "Curtsy lunge", movementPattern: "Diagonal unilateral squat", primaryMuscles: ["glutes","quads","adductors"], equipment: ["Bodyweight","Dumbbells"], difficulty: "moderate", impactLevel: "moderate", jointStressLevel: "moderate", formCues: ["Step back and across.", "Lower knee toward floor.", "Push through front foot."], substitutionReasons: ["harder","conditioning"], matchQuality: "fair", intensityChange: "same", difficultyChange: "harder", recommendationRank: 8 },
    ],
  },

  // ─── 8. Dumbbell upright row ──────────────────────────────────────────────
  {
    name: "Dumbbell upright row",
    movementPattern: "Vertical shoulder pull",
    primaryMuscles: ["medial deltoid", "upper traps", "rhomboids"],
    equipment: ["Dumbbells"],
    difficulty: "moderate",
    impactLevel: "low",
    jointStressLevel: "moderate",
    isCanonical: true,
    formCues: ["Lead with elbows.", "Keep weights close to body.", "Stand tall.", "Lower slowly."],
    substitutes: [
      { name: "Cable face pull", movementPattern: "Horizontal shoulder pull", primaryMuscles: ["rear delts","rhomboids","upper traps"], equipment: ["Cable machine"], difficulty: "beginner", impactLevel: "low", jointStressLevel: "low", formCues: ["Pull rope to face.", "Flare elbows out.", "Squeeze at end range."], substitutionReasons: ["joint_friendly","easier"], matchQuality: "good", intensityChange: "lower", difficultyChange: "easier", recommendationRank: 1, scalingNote: "Better shoulder-friendly alternative than upright row." },
      { name: "Dumbbell high pull", movementPattern: "Vertical pull + hip hinge", primaryMuscles: ["medial deltoid","traps","glutes"], equipment: ["Dumbbells"], difficulty: "moderate", impactLevel: "moderate", jointStressLevel: "moderate", formCues: ["Start in hinge.", "Drive hips and pull high.", "Elbows lead."], substitutionReasons: ["closest_match","conditioning"], matchQuality: "excellent", intensityChange: "same", difficultyChange: "same", recommendationRank: 2 },
      { name: "Barbell upright row", movementPattern: "Vertical shoulder pull", primaryMuscles: ["medial deltoid","upper traps"], equipment: ["Barbell"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "moderate", formCues: ["Grip shoulder-width.", "Lead elbows.", "Keep bar close."], substitutionReasons: ["heavier_strength","equipment_unavailable"], matchQuality: "excellent", intensityChange: "higher", difficultyChange: "same", recommendationRank: 3 },
      { name: "Cable upright row", movementPattern: "Vertical shoulder pull", primaryMuscles: ["medial deltoid","upper traps"], equipment: ["Cable machine"], difficulty: "beginner", impactLevel: "low", jointStressLevel: "low", formCues: ["Keep cable close.", "Lead elbows.", "Control descent."], substitutionReasons: ["joint_friendly","equipment_unavailable"], matchQuality: "excellent", intensityChange: "same", difficultyChange: "easier", recommendationRank: 4 },
      { name: "Dumbbell shrug", movementPattern: "Shoulder elevation", primaryMuscles: ["upper traps"], equipment: ["Dumbbells"], difficulty: "beginner", impactLevel: "low", jointStressLevel: "low", formCues: ["Hold dumbbells at sides.", "Shrug straight up.", "Hold briefly at top."], substitutionReasons: ["easier","joint_friendly"], matchQuality: "fair", intensityChange: "lower", difficultyChange: "easier", recommendationRank: 5 },
      { name: "Kettlebell upright row", movementPattern: "Vertical shoulder pull", primaryMuscles: ["medial deltoid","upper traps"], equipment: ["Kettlebells"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "moderate", formCues: ["Lead elbows.", "Keep kettlebell close.", "Stand tall."], substitutionReasons: ["equipment_unavailable","closest_match"], matchQuality: "excellent", intensityChange: "same", difficultyChange: "same", recommendationRank: 6 },
      { name: "Kettlebell high pull", movementPattern: "Ballistic hip hinge + pull", primaryMuscles: ["glutes","traps","deltoids"], equipment: ["Kettlebells"], difficulty: "moderate", impactLevel: "moderate", jointStressLevel: "moderate", formCues: ["Hinge and drive.", "Pull elbow high.", "Control the descent."], substitutionReasons: ["conditioning","harder"], matchQuality: "good", intensityChange: "higher", difficultyChange: "harder", recommendationRank: 7 },
    ],
  },

  // ─── 9. Dumbbell floor press ──────────────────────────────────────────────
  {
    name: "Dumbbell floor press",
    movementPattern: "Horizontal push",
    primaryMuscles: ["chest", "triceps", "anterior deltoid"],
    equipment: ["Dumbbells"],
    difficulty: "moderate",
    impactLevel: "low",
    jointStressLevel: "low",
    isCanonical: true,
    formCues: ["Set shoulders on the floor.", "Press powerfully.", "Lower with control.", "Keep wrists stacked over elbows."],
    substitutes: [
      { name: "Push-up", movementPattern: "Horizontal push", primaryMuscles: ["chest","triceps","anterior deltoids","trunk"], equipment: ["Bodyweight"], difficulty: "beginner", impactLevel: "low", jointStressLevel: "low", formCues: ["Hands under shoulders.", "Brace core.", "Lower chest with control."], substitutionReasons: ["no_equipment","bodyweight","easier","joint_friendly"], matchQuality: "good", intensityChange: "lower", difficultyChange: "easier", recommendationRank: 1 },
      { name: "Dumbbell bench press", movementPattern: "Horizontal push", primaryMuscles: ["chest","triceps","anterior deltoid"], equipment: ["Dumbbells","Adjustable bench"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "low", formCues: ["Lie on bench.", "Press with control.", "Bring dumbbells together at top."], substitutionReasons: ["closest_match","heavier_strength"], matchQuality: "excellent", intensityChange: "higher", difficultyChange: "same", recommendationRank: 2 },
      { name: "Barbell bench press", movementPattern: "Horizontal push", primaryMuscles: ["chest","triceps","anterior deltoid"], equipment: ["Barbell","Adjustable bench"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "moderate", formCues: ["Grip slightly wider than shoulders.", "Tuck elbows slightly.", "Touch chest, press up."], substitutionReasons: ["heavier_strength"], matchQuality: "good", intensityChange: "higher", difficultyChange: "same", recommendationRank: 3 },
      { name: "Dumbbell incline bench press", movementPattern: "Incline horizontal push", primaryMuscles: ["upper chest","triceps","anterior deltoid"], equipment: ["Dumbbells","Adjustable bench"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "low", formCues: ["Bench at 30-45 degrees.", "Press up and slightly forward.", "Control descent."], substitutionReasons: ["harder","heavier_strength"], matchQuality: "good", intensityChange: "same", difficultyChange: "same", recommendationRank: 4 },
      { name: "Parallel bar dips chest-biased", movementPattern: "Vertical push", primaryMuscles: ["chest","triceps","anterior deltoid"], equipment: ["Chin-up and dip station"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "moderate", formCues: ["Lean forward for chest bias.", "Lower until stretch in chest.", "Press back up."], substitutionReasons: ["heavier_strength","harder","conditioning"], matchQuality: "good", intensityChange: "higher", difficultyChange: "harder", recommendationRank: 5 },
      { name: "Standing cable chest press", movementPattern: "Horizontal push", primaryMuscles: ["chest","triceps","anterior deltoid"], equipment: ["Cable machine"], difficulty: "beginner", impactLevel: "low", jointStressLevel: "low", formCues: ["Set pulleys at chest height.", "Step forward.", "Press forward and together."], substitutionReasons: ["joint_friendly","equipment_unavailable"], matchQuality: "good", intensityChange: "same", difficultyChange: "easier", recommendationRank: 6 },
      { name: "Kettlebell bench press", movementPattern: "Horizontal push", primaryMuscles: ["chest","triceps","anterior deltoid"], equipment: ["Kettlebells","Adjustable bench"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "low", formCues: ["Hold kettlebells by the horns.", "Press with controlled arc.", "Neutral wrists."], substitutionReasons: ["equipment_unavailable","closest_match"], matchQuality: "excellent", intensityChange: "same", difficultyChange: "same", recommendationRank: 7 },
    ],
  },

  // ─── 10. Dumbbell bent-over row ───────────────────────────────────────────
  {
    name: "Dumbbell bent-over row",
    movementPattern: "Bilateral horizontal pull",
    primaryMuscles: ["lats", "rhomboids", "mid traps", "rear delts", "biceps", "spinal erectors"],
    equipment: ["Dumbbells"],
    difficulty: "moderate",
    impactLevel: "low",
    jointStressLevel: "moderate",
    isCanonical: true,
    formCues: ["Hinge from the hips.", "Keep back flat throughout.", "Lead with elbows.", "Squeeze shoulder blades at the top."],
    substitutes: [
      { name: "Inverted row", movementPattern: "Horizontal pull", primaryMuscles: ["lats","rhomboids","rear delts","biceps"], equipment: ["Pull-up bar"], difficulty: "beginner", impactLevel: "low", jointStressLevel: "low", formCues: ["Body straight like a plank.", "Pull chest to bar.", "Lower fully."], substitutionReasons: ["no_equipment","bodyweight","easier","joint_friendly"], matchQuality: "good", intensityChange: "lower", difficultyChange: "easier", recommendationRank: 1 },
      { name: "Barbell bent-over row", movementPattern: "Bilateral horizontal pull", primaryMuscles: ["lats","rhomboids","mid traps","rear delts"], equipment: ["Barbell"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "moderate", formCues: ["Hinge until torso near parallel.", "Pull bar to lower ribs.", "Keep back flat."], substitutionReasons: ["heavier_strength","closest_match"], matchQuality: "excellent", intensityChange: "higher", difficultyChange: "same", recommendationRank: 2 },
      { name: "Chest-supported dumbbell row", movementPattern: "Bilateral horizontal pull", primaryMuscles: ["lats","rhomboids","rear delts"], equipment: ["Dumbbells","Adjustable bench"], difficulty: "beginner", impactLevel: "low", jointStressLevel: "low", formCues: ["Lie face down on incline.", "Row both dumbbells.", "Remove lower back from equation."], substitutionReasons: ["joint_friendly","easier"], matchQuality: "excellent", intensityChange: "same", difficultyChange: "easier", recommendationRank: 3 },
      { name: "Pendlay row", movementPattern: "Bilateral horizontal pull", primaryMuscles: ["lats","rhomboids","spinal erectors"], equipment: ["Barbell"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "moderate", formCues: ["Bar starts on floor each rep.", "Torso near parallel.", "Explosive pull."], substitutionReasons: ["heavier_strength","conditioning"], matchQuality: "good", intensityChange: "higher", difficultyChange: "harder", recommendationRank: 4 },
      { name: "Seated cable row", movementPattern: "Horizontal pull", primaryMuscles: ["lats","rhomboids","mid traps"], equipment: ["Cable machine"], difficulty: "beginner", impactLevel: "low", jointStressLevel: "low", formCues: ["Sit tall.", "Pull to lower ribs.", "Don't lean back excessively."], substitutionReasons: ["joint_friendly","equipment_unavailable"], matchQuality: "good", intensityChange: "same", difficultyChange: "easier", recommendationRank: 6 },
      { name: "Kettlebell bent-over row", movementPattern: "Bilateral horizontal pull", primaryMuscles: ["lats","rhomboids","rear delts"], equipment: ["Kettlebells"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "moderate", formCues: ["Hold kettlebells.", "Row to lower ribs.", "Keep back flat."], substitutionReasons: ["equipment_unavailable","closest_match"], matchQuality: "excellent", intensityChange: "same", difficultyChange: "same", recommendationRank: 7 },
      { name: "Seal row", movementPattern: "Bilateral horizontal pull", primaryMuscles: ["lats","rhomboids","rear delts"], equipment: ["Dumbbells","Adjustable bench"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "low", formCues: ["Lie face-down on elevated bench.", "Arms hang fully.", "Row both dumbbells."], substitutionReasons: ["joint_friendly","heavier_strength"], matchQuality: "excellent", intensityChange: "same", difficultyChange: "same", recommendationRank: 8 },
    ],
  },

  // ─── 11. Plank ────────────────────────────────────────────────────────────
  {
    name: "Plank",
    movementPattern: "Anti-extension isometric",
    primaryMuscles: ["rectus abdominis", "transverse abdominis", "shoulders", "glutes"],
    equipment: ["Bodyweight"],
    difficulty: "beginner",
    impactLevel: "low",
    jointStressLevel: "low",
    isCanonical: true,
    formCues: ["Elbows under shoulders.", "Body in one straight line.", "Brace abs and glutes together.", "Breathe steadily."],
    substitutes: [
      { name: "Dead bug", movementPattern: "Anti-extension with limb movement", primaryMuscles: ["transverse abdominis","trunk"], equipment: ["Bodyweight"], difficulty: "beginner", impactLevel: "low", jointStressLevel: "low", formCues: ["Lower back glued to floor.", "Extend opposite limbs.", "Breathe out as you extend."], substitutionReasons: ["joint_friendly","easier","no_equipment","bodyweight"], matchQuality: "good", intensityChange: "lower", difficultyChange: "easier", recommendationRank: 1 },
      { name: "Hollow-body hold", movementPattern: "Anti-extension isometric", primaryMuscles: ["rectus abdominis","hip flexors","trunk"], equipment: ["Bodyweight"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "low", formCues: ["Arms overhead, legs raised.", "Lower back pressed to floor.", "Hold tight."], substitutionReasons: ["closest_match","harder","bodyweight","no_equipment"], matchQuality: "excellent", intensityChange: "same", difficultyChange: "harder", recommendationRank: 2 },
      { name: "Bird dog", movementPattern: "Anti-extension with rotation", primaryMuscles: ["spinal erectors","glutes","trunk"], equipment: ["Bodyweight"], difficulty: "beginner", impactLevel: "low", jointStressLevel: "low", formCues: ["On hands and knees.", "Extend opposite arm and leg.", "Keep hips level."], substitutionReasons: ["joint_friendly","easier","no_equipment"], matchQuality: "good", intensityChange: "lower", difficultyChange: "easier", recommendationRank: 3 },
      { name: "Plank with shoulder taps", movementPattern: "Anti-extension anti-rotation", primaryMuscles: ["rectus abdominis","trunk","shoulders"], equipment: ["Bodyweight"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "low", formCues: ["High plank position.", "Tap shoulder without rotating.", "Feet wide for stability."], substitutionReasons: ["closest_match","harder"], matchQuality: "excellent", intensityChange: "same", difficultyChange: "harder", recommendationRank: 4 },
      { name: "Heavy farmer's carry", movementPattern: "Anti-extension locomotion", primaryMuscles: ["trunk","grip","traps","glutes"], equipment: ["Dumbbells","Kettlebells"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "low", formCues: ["Stand tall.", "Walk with control.", "Don't let shoulders drop."], substitutionReasons: ["conditioning","harder","heavier_strength"], matchQuality: "fair", intensityChange: "higher", difficultyChange: "harder", recommendationRank: 5, scalingNote: "Use a marked distance — 20m is a good starting point." },
      { name: "Barbell rollout from knees", movementPattern: "Anti-extension dynamic", primaryMuscles: ["rectus abdominis","hip flexors","lats"], equipment: ["Barbell"], difficulty: "advanced", impactLevel: "low", jointStressLevel: "moderate", formCues: ["On knees.", "Roll bar forward until hips break.", "Pull back with abs."], substitutionReasons: ["harder"], matchQuality: "good", intensityChange: "higher", difficultyChange: "harder", recommendationRank: 6, isAdvanced: true },
      { name: "Hanging knee raise", movementPattern: "Anti-extension hip flexion", primaryMuscles: ["rectus abdominis","hip flexors"], equipment: ["Pull-up bar"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "low", formCues: ["Dead hang.", "Bring knees to chest.", "Lower with control."], substitutionReasons: ["harder","conditioning"], matchQuality: "fair", intensityChange: "higher", difficultyChange: "harder", recommendationRank: 7 },
      { name: "Suitcase carry", movementPattern: "Anti-lateral-flexion locomotion", primaryMuscles: ["obliques","quadratus lumborum","grip","trunk"], equipment: ["Dumbbells","Kettlebells"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "low", formCues: ["Hold weight one side.", "Walk tall.", "Don't lean away."], substitutionReasons: ["conditioning","harder"], matchQuality: "fair", intensityChange: "same", difficultyChange: "same", recommendationRank: 8 },
    ],
  },

  // ─── 12. Dumbbell goblet squat ────────────────────────────────────────────
  {
    name: "Dumbbell goblet squat",
    movementPattern: "Bilateral front-loaded squat",
    primaryMuscles: ["quads", "glutes", "upper back", "trunk"],
    equipment: ["Dumbbells"],
    difficulty: "beginner",
    impactLevel: "low",
    jointStressLevel: "low",
    isCanonical: true,
    formCues: ["Hold dumbbell by one end at chest.", "Keep torso upright.", "Sit between your heels.", "Drive up with control."],
    substitutes: [
      { name: "Kettlebell goblet squat", movementPattern: "Bilateral front-loaded squat", primaryMuscles: ["quads","glutes","upper back"], equipment: ["Kettlebells"], difficulty: "beginner", impactLevel: "low", jointStressLevel: "low", formCues: ["Hold by the horns at chest.", "Drive elbows between knees.", "Sit tall."], substitutionReasons: ["closest_match","equipment_unavailable"], matchQuality: "excellent", intensityChange: "same", difficultyChange: "same", recommendationRank: 1 },
      { name: "Bodyweight squat", movementPattern: "Bilateral knee-dominant squat", primaryMuscles: ["quads","glutes","hamstrings"], equipment: ["Bodyweight"], difficulty: "beginner", impactLevel: "low", jointStressLevel: "low", formCues: ["Arms forward.", "Sit back.", "Stand tall."], substitutionReasons: ["no_equipment","bodyweight","easier","joint_friendly"], matchQuality: "good", intensityChange: "lower", difficultyChange: "easier", recommendationRank: 2 },
      { name: "Heels-elevated goblet squat", movementPattern: "Bilateral front-loaded squat", primaryMuscles: ["quads","glutes"], equipment: ["Dumbbells"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "low", formCues: ["Heels on a 1-2 inch raise.", "Same goblet technique.", "Greater quad emphasis."], substitutionReasons: ["harder","closest_match"], matchQuality: "excellent", intensityChange: "same", difficultyChange: "harder", recommendationRank: 3 },
      { name: "Barbell front squat", movementPattern: "Bilateral front-loaded squat", primaryMuscles: ["quads","glutes","upper back"], equipment: ["Barbell"], difficulty: "advanced", impactLevel: "moderate", jointStressLevel: "moderate", formCues: ["Elbows high.", "Bar on front delts.", "Upright torso."], substitutionReasons: ["heavier_strength","harder"], matchQuality: "good", intensityChange: "higher", difficultyChange: "harder", recommendationRank: 4, isAdvanced: true },
      { name: "Tempo goblet squat", movementPattern: "Bilateral front-loaded squat", primaryMuscles: ["quads","glutes"], equipment: ["Dumbbells","Kettlebells"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "low", formCues: ["4 seconds down.", "Pause at bottom.", "Drive up."], substitutionReasons: ["harder","joint_friendly"], matchQuality: "excellent", intensityChange: "same", difficultyChange: "harder", recommendationRank: 5 },
      { name: "Jump squat", movementPattern: "Bilateral plyometric squat", primaryMuscles: ["quads","glutes","calves"], equipment: ["Bodyweight"], difficulty: "moderate", impactLevel: "high", jointStressLevel: "moderate", formCues: ["Explode from bottom.", "Land softly.", "Reset each rep."], substitutionReasons: ["conditioning","no_equipment","bodyweight"], matchQuality: "fair", intensityChange: "higher", difficultyChange: "same", recommendationRank: 6, cautionNote: "High impact. Hard surfaces not recommended." },
    ],
  },

  // ─── 13. Dumbbell lateral raise ───────────────────────────────────────────
  {
    name: "Dumbbell lateral raise",
    movementPattern: "Shoulder abduction",
    primaryMuscles: ["medial deltoid"],
    equipment: ["Dumbbells"],
    difficulty: "beginner",
    impactLevel: "low",
    jointStressLevel: "low",
    isCanonical: true,
    formCues: ["Lead with elbows, not wrists.", "Raise to shoulder height only.", "Keep shoulders down.", "Control the lowering phase."],
    substitutes: [
      { name: "Cable single-arm lateral raise", movementPattern: "Shoulder abduction", primaryMuscles: ["medial deltoid"], equipment: ["Cable machine"], difficulty: "beginner", impactLevel: "low", jointStressLevel: "low", formCues: ["Cable from low pulley.", "Raise across body.", "Keep shoulder down."], substitutionReasons: ["closest_match","joint_friendly"], matchQuality: "excellent", intensityChange: "same", difficultyChange: "same", recommendationRank: 1 },
      { name: "Leaning dumbbell lateral raise", movementPattern: "Shoulder abduction", primaryMuscles: ["medial deltoid"], equipment: ["Dumbbells"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "low", formCues: ["Hold a fixed support.", "Lean away.", "Raise with full range."], substitutionReasons: ["harder","closest_match"], matchQuality: "excellent", intensityChange: "same", difficultyChange: "harder", recommendationRank: 2 },
      { name: "Kettlebell lateral raise", movementPattern: "Shoulder abduction", primaryMuscles: ["medial deltoid"], equipment: ["Kettlebells"], difficulty: "beginner", impactLevel: "low", jointStressLevel: "low", formCues: ["Hold kettlebell from horn.", "Raise with control.", "Keep shoulder down."], substitutionReasons: ["equipment_unavailable","closest_match"], matchQuality: "excellent", intensityChange: "same", difficultyChange: "same", recommendationRank: 3 },
      { name: "Dumbbell three-way shoulder raise", movementPattern: "Multi-plane shoulder raise", primaryMuscles: ["anterior deltoid","medial deltoid","posterior deltoid"], equipment: ["Dumbbells"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "moderate", formCues: ["Front raise, then lateral, then rear.", "Use lighter weight.", "Control all three planes."], substitutionReasons: ["harder","conditioning"], matchQuality: "good", intensityChange: "same", difficultyChange: "harder", recommendationRank: 4 },
      { name: "Egyptian lateral raise", movementPattern: "Shoulder abduction", primaryMuscles: ["medial deltoid"], equipment: ["Dumbbells","Cable machine"], difficulty: "advanced", impactLevel: "low", jointStressLevel: "moderate", formCues: ["Anchor one arm on a fixed point.", "Lean away.", "Raise arm from hip to overhead."], substitutionReasons: ["harder"], matchQuality: "good", intensityChange: "same", difficultyChange: "harder", recommendationRank: 5, isAdvanced: true },
      { name: "Seated dumbbell lateral raise", movementPattern: "Shoulder abduction", primaryMuscles: ["medial deltoid"], equipment: ["Dumbbells"], difficulty: "beginner", impactLevel: "low", jointStressLevel: "low", formCues: ["Sit on edge of bench.", "Raise slowly.", "Avoid shrugging."], substitutionReasons: ["easier","joint_friendly"], matchQuality: "excellent", intensityChange: "lower", difficultyChange: "easier", recommendationRank: 6 },
    ],
  },

  // ─── 14. Push-up ──────────────────────────────────────────────────────────
  {
    name: "Push-up",
    movementPattern: "Horizontal push",
    primaryMuscles: ["chest", "triceps", "anterior deltoids", "trunk"],
    equipment: ["Bodyweight"],
    difficulty: "beginner",
    impactLevel: "low",
    jointStressLevel: "low",
    isCanonical: true,
    formCues: ["Hands under shoulders.", "Brace core and glutes.", "Lower chest with full control.", "Press back powerfully."],
    substitutes: [
      { name: "Knee push-up", movementPattern: "Horizontal push", primaryMuscles: ["chest","triceps","anterior deltoids"], equipment: ["Bodyweight"], difficulty: "beginner", impactLevel: "low", jointStressLevel: "low", formCues: ["Knees on floor.", "Maintain body line from knees up.", "Full range."], substitutionReasons: ["easier","joint_friendly","no_equipment","bodyweight"], matchQuality: "good", intensityChange: "lower", difficultyChange: "easier", recommendationRank: 1 },
      { name: "Decline push-up", movementPattern: "Incline horizontal push", primaryMuscles: ["upper chest","triceps","anterior deltoids"], equipment: ["Bodyweight"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "low", formCues: ["Feet elevated.", "Same body alignment.", "Full range."], substitutionReasons: ["harder","closest_match"], matchQuality: "excellent", intensityChange: "higher", difficultyChange: "harder", recommendationRank: 2 },
      { name: "Weighted push-up", movementPattern: "Horizontal push", primaryMuscles: ["chest","triceps","trunk"], equipment: ["Bodyweight","Dumbbells"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "low", formCues: ["Place weight on upper back.", "Same technique.", "Control descent."], substitutionReasons: ["harder","heavier_strength"], matchQuality: "excellent", intensityChange: "higher", difficultyChange: "harder", recommendationRank: 3 },
      { name: "Plyometric push-up", movementPattern: "Explosive horizontal push", primaryMuscles: ["chest","triceps","anterior deltoids"], equipment: ["Bodyweight"], difficulty: "moderate", impactLevel: "moderate", jointStressLevel: "moderate", formCues: ["Explode off floor.", "Land softly.", "Reset each rep."], substitutionReasons: ["conditioning","harder","no_equipment","bodyweight"], matchQuality: "good", intensityChange: "higher", difficultyChange: "harder", recommendationRank: 4, cautionNote: "Wrist stress on landing. Keep reps quality over quantity." },
      { name: "Hindu push-up", movementPattern: "Dynamic horizontal push with extension", primaryMuscles: ["chest","triceps","shoulders","spinal erectors"], equipment: ["Bodyweight"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "moderate", formCues: ["Start in downward dog.", "Swoop forward and up.", "Return to start."], substitutionReasons: ["conditioning","harder","no_equipment"], matchQuality: "fair", intensityChange: "higher", difficultyChange: "harder", recommendationRank: 5 },
      { name: "Dip", movementPattern: "Vertical push", primaryMuscles: ["triceps","chest","anterior deltoid"], equipment: ["Chin-up and dip station"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "moderate", formCues: ["Stay upright for tricep focus.", "Lower until elbows 90 degrees.", "Press up fully."], substitutionReasons: ["harder","heavier_strength"], matchQuality: "good", intensityChange: "higher", difficultyChange: "harder", recommendationRank: 6 },
      { name: "Pseudo-planche push-up", movementPattern: "Horizontal push with forward lean", primaryMuscles: ["chest","anterior deltoids","triceps","trunk"], equipment: ["Bodyweight"], difficulty: "advanced", impactLevel: "low", jointStressLevel: "high", formCues: ["Hands at hips.", "Lean body forward.", "Lower slowly."], substitutionReasons: ["harder","bodyweight"], matchQuality: "fair", intensityChange: "higher", difficultyChange: "harder", recommendationRank: 7, isAdvanced: true, cautionNote: "High wrist stress. Use only if confident." },
      { name: "One-arm push-up", movementPattern: "Unilateral horizontal push", primaryMuscles: ["chest","triceps","trunk"], equipment: ["Bodyweight"], difficulty: "advanced", impactLevel: "low", jointStressLevel: "high", formCues: ["Feet wide.", "Lower slowly.", "Minimize rotation."], substitutionReasons: ["harder","bodyweight","no_equipment"], matchQuality: "fair", intensityChange: "higher", difficultyChange: "harder", recommendationRank: 8, isAdvanced: true, cautionNote: "Extreme demand on wrist and shoulder. Very advanced." },
    ],
  },

  // ─── 15. Dumbbell single-arm row ──────────────────────────────────────────
  {
    name: "Dumbbell single-arm row",
    movementPattern: "Unilateral horizontal pull",
    primaryMuscles: ["lats", "rhomboids", "rear delt", "biceps"],
    equipment: ["Dumbbells"],
    difficulty: "moderate",
    impactLevel: "low",
    jointStressLevel: "low",
    isCanonical: true,
    formCues: ["Support yourself on a bench.", "Row toward your side.", "Lead with the elbow.", "Control the lowering phase fully."],
    substitutes: [
      { name: "Three-point dumbbell row", movementPattern: "Unilateral horizontal pull", primaryMuscles: ["lats","rhomboids","rear delt"], equipment: ["Dumbbells"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "low", formCues: ["Hand on bench, feet wide.", "Row to hip.", "No torso rotation."], substitutionReasons: ["closest_match"], matchQuality: "excellent", intensityChange: "same", difficultyChange: "same", recommendationRank: 1 },
      { name: "Chest-supported single-arm dumbbell row", movementPattern: "Unilateral horizontal pull", primaryMuscles: ["lats","rhomboids","rear delt"], equipment: ["Dumbbells","Adjustable bench"], difficulty: "beginner", impactLevel: "low", jointStressLevel: "low", formCues: ["Lie on incline bench.", "Row to hip.", "Full stretch at bottom."], substitutionReasons: ["joint_friendly","easier"], matchQuality: "excellent", intensityChange: "same", difficultyChange: "easier", recommendationRank: 2 },
      { name: "Kettlebell single-arm row", movementPattern: "Unilateral horizontal pull", primaryMuscles: ["lats","rhomboids","rear delt"], equipment: ["Kettlebells"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "low", formCues: ["Same technique as dumbbell.", "Lead with elbow.", "Control descent."], substitutionReasons: ["equipment_unavailable","closest_match"], matchQuality: "excellent", intensityChange: "same", difficultyChange: "same", recommendationRank: 3 },
      { name: "Standing cable single-arm row", movementPattern: "Unilateral horizontal pull", primaryMuscles: ["lats","rhomboids","rear delt"], equipment: ["Cable machine"], difficulty: "beginner", impactLevel: "low", jointStressLevel: "low", formCues: ["Step back.", "Row to hip.", "Tall posture."], substitutionReasons: ["joint_friendly","equipment_unavailable"], matchQuality: "excellent", intensityChange: "same", difficultyChange: "easier", recommendationRank: 4 },
      { name: "Archer pull-up", movementPattern: "Unilateral vertical pull", primaryMuscles: ["lats","biceps","trunk"], equipment: ["Pull-up bar"], difficulty: "advanced", impactLevel: "low", jointStressLevel: "moderate", formCues: ["Wide grip.", "Pull toward one arm.", "Lower slowly."], substitutionReasons: ["harder","conditioning"], matchQuality: "fair", intensityChange: "higher", difficultyChange: "harder", recommendationRank: 5, isAdvanced: true },
      { name: "Meadows row", movementPattern: "Unilateral horizontal pull", primaryMuscles: ["lats","rear delt","biceps"], equipment: ["Barbell"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "low", formCues: ["Barbell in a landmine.", "Step beside it.", "Row to hip."], substitutionReasons: ["heavier_strength"], matchQuality: "good", intensityChange: "higher", difficultyChange: "same", recommendationRank: 6 },
      { name: "Archer inverted row", movementPattern: "Unilateral horizontal pull", primaryMuscles: ["lats","rhomboids","trunk"], equipment: ["Pull-up bar"], difficulty: "advanced", impactLevel: "low", jointStressLevel: "low", formCues: ["Bar at hip height.", "Shift body to one side.", "Pull toward loaded arm."], substitutionReasons: ["harder","bodyweight","no_equipment"], matchQuality: "good", intensityChange: "higher", difficultyChange: "harder", recommendationRank: 7, isAdvanced: true },
      { name: "Kroc row", movementPattern: "Heavy unilateral horizontal pull", primaryMuscles: ["lats","rhomboids","grip"], equipment: ["Dumbbells"], difficulty: "advanced", impactLevel: "low", jointStressLevel: "moderate", formCues: ["Heavy dumbbell.", "Use body momentum slightly.", "Full range of motion."], substitutionReasons: ["heavier_strength","harder"], matchQuality: "good", intensityChange: "higher", difficultyChange: "harder", recommendationRank: 8, isAdvanced: true, cautionNote: "High load on spine. Build base strength first." },
    ],
  },

  // ─── 16. Dumbbell side bend ───────────────────────────────────────────────
  {
    name: "Dumbbell side bend",
    movementPattern: "Lateral flexion",
    primaryMuscles: ["obliques", "quadratus lumborum"],
    equipment: ["Dumbbells"],
    difficulty: "beginner",
    impactLevel: "low",
    jointStressLevel: "low",
    isCanonical: true,
    formCues: ["Use one dumbbell only.", "Bend slowly to the side.", "Keep hips square.", "Use your obliques to return."],
    substitutes: [
      { name: "Suitcase carry", movementPattern: "Anti-lateral-flexion locomotion", primaryMuscles: ["obliques","quadratus lumborum","grip"], equipment: ["Dumbbells","Kettlebells"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "low", formCues: ["Walk tall holding one side only.", "Don't lean away.", "Alternate sides."], substitutionReasons: ["closest_match","conditioning","joint_friendly"], matchQuality: "good", intensityChange: "same", difficultyChange: "same", recommendationRank: 1, scalingNote: "Isometric lateral stability rather than dynamic flexion." },
      { name: "Dumbbell Russian twist", movementPattern: "Rotational", primaryMuscles: ["obliques","trunk"], equipment: ["Dumbbells","Bodyweight"], difficulty: "beginner", impactLevel: "low", jointStressLevel: "low", formCues: ["Sit with feet off floor.", "Rotate dumbbell side to side.", "Keep chest up."], substitutionReasons: ["closest_match","no_equipment","bodyweight"], matchQuality: "good", intensityChange: "same", difficultyChange: "same", recommendationRank: 2 },
      { name: "Cable wood chop high-to-low", movementPattern: "Rotational diagonal", primaryMuscles: ["obliques","trunk","glutes"], equipment: ["Cable machine"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "low", formCues: ["Cable at high pulley.", "Rotate down and across.", "Pivot back foot."], substitutionReasons: ["harder","equipment_unavailable"], matchQuality: "good", intensityChange: "higher", difficultyChange: "harder", recommendationRank: 3 },
      { name: "Kettlebell windmill", movementPattern: "Lateral hinge + rotation", primaryMuscles: ["obliques","glutes","shoulders"], equipment: ["Kettlebells"], difficulty: "advanced", impactLevel: "low", jointStressLevel: "moderate", formCues: ["Press kettlebell overhead.", "Hinge and rotate to touch floor.", "Eyes on the kettlebell."], substitutionReasons: ["harder","conditioning"], matchQuality: "fair", intensityChange: "higher", difficultyChange: "harder", recommendationRank: 4, isAdvanced: true, cautionNote: "Complex movement. Learn without weight first." },
      { name: "Turkish get-up", movementPattern: "Rotational locomotion", primaryMuscles: ["shoulders","trunk","glutes","hips"], equipment: ["Kettlebells","Dumbbells"], difficulty: "advanced", impactLevel: "low", jointStressLevel: "moderate", formCues: ["Move slowly through each phase.", "Eye stays on the bell.", "Alternate sides."], substitutionReasons: ["harder","heavier_strength"], matchQuality: "fair", intensityChange: "higher", difficultyChange: "harder", recommendationRank: 5, isAdvanced: true, cautionNote: "Technical. Learn without weight first." },
      { name: "Landmine 180", movementPattern: "Rotational anti-extension", primaryMuscles: ["obliques","trunk","shoulders"], equipment: ["Barbell"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "low", formCues: ["Hold barbell end with both hands.", "Rotate arc from hip to hip.", "Control the movement."], substitutionReasons: ["conditioning","heavier_strength"], matchQuality: "good", intensityChange: "higher", difficultyChange: "harder", recommendationRank: 6 },
      { name: "Hanging oblique knee raise", movementPattern: "Lateral hip flexion", primaryMuscles: ["obliques","hip flexors"], equipment: ["Pull-up bar"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "low", formCues: ["Dead hang.", "Bring knees up and to one side.", "Lower with control."], substitutionReasons: ["harder","conditioning"], matchQuality: "fair", intensityChange: "higher", difficultyChange: "harder", recommendationRank: 7 },
    ],
  },

  // ─── 17. Dumbbell reverse lunge ───────────────────────────────────────────
  {
    name: "Dumbbell reverse lunge",
    movementPattern: "Unilateral knee-dominant reverse step",
    primaryMuscles: ["quads", "glutes", "hamstrings"],
    equipment: ["Dumbbells"],
    difficulty: "moderate",
    impactLevel: "low",
    jointStressLevel: "low",
    isCanonical: true,
    formCues: ["Step back softly.", "Bend both knees to 90 degrees.", "Push through the front foot to return.", "Keep torso upright."],
    substitutes: [
      { name: "Bodyweight reverse lunge", movementPattern: "Unilateral knee-dominant reverse step", primaryMuscles: ["quads","glutes","hamstrings"], equipment: ["Bodyweight"], difficulty: "beginner", impactLevel: "low", jointStressLevel: "low", formCues: ["Step back with control.", "Both knees near 90 degrees.", "Push from front foot."], substitutionReasons: ["no_equipment","bodyweight","easier","joint_friendly"], matchQuality: "excellent", intensityChange: "lower", difficultyChange: "easier", recommendationRank: 1 },
      { name: "Barbell reverse lunge", movementPattern: "Unilateral knee-dominant reverse step", primaryMuscles: ["quads","glutes","hamstrings"], equipment: ["Barbell"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "low", formCues: ["Bar on upper back.", "Step back with control.", "Maintain upright torso."], substitutionReasons: ["heavier_strength","closest_match"], matchQuality: "excellent", intensityChange: "higher", difficultyChange: "same", recommendationRank: 2 },
      { name: "Kettlebell goblet reverse lunge", movementPattern: "Unilateral knee-dominant reverse step", primaryMuscles: ["quads","glutes","hamstrings","upper back"], equipment: ["Kettlebells"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "low", formCues: ["Hold kettlebell at chest.", "Step back with control.", "Stay tall."], substitutionReasons: ["equipment_unavailable","closest_match"], matchQuality: "excellent", intensityChange: "same", difficultyChange: "same", recommendationRank: 3 },
      { name: "Bulgarian split squat", movementPattern: "Unilateral knee-dominant squat", primaryMuscles: ["quads","glutes","hamstrings"], equipment: ["Bodyweight","Dumbbells"], difficulty: "moderate", impactLevel: "moderate", jointStressLevel: "moderate", formCues: ["Rear foot elevated.", "Front shin vertical.", "Lower rear knee."], substitutionReasons: ["harder","heavier_strength"], matchQuality: "good", intensityChange: "higher", difficultyChange: "harder", recommendationRank: 4 },
      { name: "Deficit reverse lunge", movementPattern: "Extended unilateral knee-dominant reverse step", primaryMuscles: ["quads","glutes","hamstrings"], equipment: ["Dumbbells","Bodyweight"], difficulty: "advanced", impactLevel: "low", jointStressLevel: "moderate", formCues: ["Step up on a small plate or step.", "Lunge back from elevation.", "Greater range of motion."], substitutionReasons: ["harder"], matchQuality: "good", intensityChange: "higher", difficultyChange: "harder", recommendationRank: 5, isAdvanced: true },
      { name: "Curtsy lunge", movementPattern: "Diagonal unilateral squat", primaryMuscles: ["glutes","quads","adductors"], equipment: ["Bodyweight","Dumbbells"], difficulty: "moderate", impactLevel: "moderate", jointStressLevel: "moderate", formCues: ["Step back and across.", "Lower rear knee.", "Push from front foot."], substitutionReasons: ["harder","conditioning"], matchQuality: "fair", intensityChange: "same", difficultyChange: "harder", recommendationRank: 6 },
    ],
  },

  // ─── 18. Dumbbell halo ────────────────────────────────────────────────────
  {
    name: "Dumbbell halo",
    movementPattern: "Shoulder mobility and anti-rotation",
    primaryMuscles: ["shoulders", "upper back", "trunk"],
    equipment: ["Dumbbells"],
    difficulty: "beginner",
    impactLevel: "low",
    jointStressLevel: "low",
    isCanonical: true,
    formCues: ["Move the weight around your head.", "Keep ribs down.", "Control the weight in both directions.", "Alternate clockwise and anti-clockwise."],
    substitutes: [
      { name: "Kettlebell halo", movementPattern: "Shoulder mobility and anti-rotation", primaryMuscles: ["shoulders","upper back","trunk"], equipment: ["Kettlebells"], difficulty: "beginner", impactLevel: "low", jointStressLevel: "low", formCues: ["Hold by the horns.", "Circle the kettlebell.", "Keep ribs down."], substitutionReasons: ["closest_match","equipment_unavailable"], matchQuality: "excellent", intensityChange: "same", difficultyChange: "same", recommendationRank: 1 },
      { name: "Barbell plate halo", movementPattern: "Shoulder mobility", primaryMuscles: ["shoulders","upper back"], equipment: ["Barbell"], difficulty: "beginner", impactLevel: "low", jointStressLevel: "low", formCues: ["Hold plate vertically.", "Circle around head.", "Keep ribs down."], substitutionReasons: ["equipment_unavailable","closest_match"], matchQuality: "excellent", intensityChange: "same", difficultyChange: "same", recommendationRank: 2 },
      { name: "Cable Pallof press", movementPattern: "Anti-rotation", primaryMuscles: ["trunk","obliques","shoulders"], equipment: ["Cable machine"], difficulty: "beginner", impactLevel: "low", jointStressLevel: "low", formCues: ["Stand side-on to cable.", "Press handle out.", "Hold and resist rotation."], substitutionReasons: ["joint_friendly","easier","no_equipment"], matchQuality: "fair", intensityChange: "lower", difficultyChange: "easier", recommendationRank: 3 },
      { name: "Kettlebell around-the-world", movementPattern: "Shoulder mobility and anti-rotation", primaryMuscles: ["shoulders","upper back","trunk"], equipment: ["Kettlebells"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "low", formCues: ["Pass kettlebell around waist.", "Keep hips still.", "Alternate directions."], substitutionReasons: ["closest_match","conditioning"], matchQuality: "good", intensityChange: "same", difficultyChange: "same", recommendationRank: 4 },
      { name: "Kettlebell waiter walk", movementPattern: "Overhead stabilisation locomotion", primaryMuscles: ["shoulders","trunk","grip"], equipment: ["Kettlebells"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "moderate", formCues: ["Press kettlebell overhead.", "Walk with control.", "Keep shoulder packed."], substitutionReasons: ["harder","conditioning"], matchQuality: "fair", intensityChange: "higher", difficultyChange: "harder", recommendationRank: 5, cautionNote: "Good shoulder stability needed overhead." },
      { name: "Turkish get-up", movementPattern: "Rotational locomotion", primaryMuscles: ["shoulders","trunk","glutes","hips"], equipment: ["Kettlebells","Dumbbells"], difficulty: "advanced", impactLevel: "low", jointStressLevel: "moderate", formCues: ["Move through each phase slowly.", "Eye on the bell.", "Alternate sides."], substitutionReasons: ["harder","heavier_strength"], matchQuality: "fair", intensityChange: "higher", difficultyChange: "harder", recommendationRank: 6, isAdvanced: true },
    ],
  },

  // ─── 19. Diamond push-up ──────────────────────────────────────────────────
  {
    name: "Diamond push-up",
    movementPattern: "Narrow-grip horizontal push",
    primaryMuscles: ["triceps", "chest", "anterior deltoid"],
    equipment: ["Bodyweight"],
    difficulty: "moderate",
    impactLevel: "low",
    jointStressLevel: "moderate",
    isCanonical: true,
    formCues: ["Make a diamond shape with thumbs and forefingers.", "Keep elbows close to your sides.", "Lower under full control.", "Drop to knees if form breaks."],
    substitutes: [
      { name: "Close-grip push-up", movementPattern: "Narrow horizontal push", primaryMuscles: ["triceps","chest"], equipment: ["Bodyweight"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "low", formCues: ["Hands inside shoulder width.", "Elbows brush ribs.", "Full range."], substitutionReasons: ["closest_match","joint_friendly","easier"], matchQuality: "excellent", intensityChange: "lower", difficultyChange: "easier", recommendationRank: 1 },
      { name: "Barbell close-grip floor press", movementPattern: "Narrow horizontal push", primaryMuscles: ["triceps","chest"], equipment: ["Barbell"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "low", formCues: ["Narrow grip on bar.", "Lower to chest.", "Elbows close to ribs."], substitutionReasons: ["heavier_strength","equipment_unavailable"], matchQuality: "good", intensityChange: "higher", difficultyChange: "same", recommendationRank: 2 },
      { name: "Weighted dips", movementPattern: "Vertical push", primaryMuscles: ["triceps","chest","anterior deltoid"], equipment: ["Chin-up and dip station","Dumbbells"], difficulty: "advanced", impactLevel: "moderate", jointStressLevel: "moderate", formCues: ["Add weight via belt or dumbbell.", "Stay upright.", "Control descent."], substitutionReasons: ["heavier_strength","harder"], matchQuality: "good", intensityChange: "higher", difficultyChange: "harder", recommendationRank: 3, isAdvanced: true, cautionNote: "Significant shoulder stress. Use only if dips are strong." },
      { name: "Cable straight-bar pressdown", movementPattern: "Elbow extension", primaryMuscles: ["triceps"], equipment: ["Cable machine"], difficulty: "beginner", impactLevel: "low", jointStressLevel: "low", formCues: ["Keep elbows fixed.", "Press down fully.", "Control return."], substitutionReasons: ["joint_friendly","easier","equipment_unavailable"], matchQuality: "good", intensityChange: "lower", difficultyChange: "easier", recommendationRank: 4 },
      { name: "Bench dip weighted with dumbbell", movementPattern: "Elbow extension", primaryMuscles: ["triceps","anterior deltoid"], equipment: ["Dumbbells"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "moderate", formCues: ["Dumbbell on thighs.", "Dip with control.", "Feet can be elevated."], substitutionReasons: ["harder","heavier_strength"], matchQuality: "good", intensityChange: "higher", difficultyChange: "harder", recommendationRank: 5, cautionNote: "Shoulder stress at depth. Control range of motion." },
      { name: "Pseudo-planche push-up", movementPattern: "Horizontal push with forward lean", primaryMuscles: ["triceps","anterior deltoids","chest"], equipment: ["Bodyweight"], difficulty: "advanced", impactLevel: "low", jointStressLevel: "high", formCues: ["Hands at hip level.", "Lean forward.", "Lower slowly."], substitutionReasons: ["harder","bodyweight"], matchQuality: "fair", intensityChange: "higher", difficultyChange: "harder", recommendationRank: 6, isAdvanced: true, cautionNote: "High wrist stress. Advanced movement only." },
    ],
  },

  // ─── 20. Dumbbell reverse-grip bent-over row ──────────────────────────────
  {
    name: "Dumbbell reverse-grip bent-over row",
    movementPattern: "Supinated horizontal pull",
    primaryMuscles: ["lats", "lower traps", "biceps", "rear delts"],
    equipment: ["Dumbbells"],
    difficulty: "moderate",
    impactLevel: "low",
    jointStressLevel: "moderate",
    isCanonical: true,
    formCues: ["Palms face forward.", "Hinge from the hips.", "Row to your sides.", "Lower with full control."],
    substitutes: [
      { name: "Chin-up", movementPattern: "Supinated vertical pull", primaryMuscles: ["lats","biceps","lower traps"], equipment: ["Pull-up bar"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "low", formCues: ["Palms toward you.", "Pull until chin over bar.", "Lower fully."], substitutionReasons: ["closest_match","heavier_strength","conditioning","bodyweight"], matchQuality: "excellent", intensityChange: "higher", difficultyChange: "harder", recommendationRank: 1 },
      { name: "Barbell reverse-grip bent-over row", movementPattern: "Supinated horizontal pull", primaryMuscles: ["lats","lower traps","biceps"], equipment: ["Barbell"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "moderate", formCues: ["Palms face up.", "Pull to lower abs.", "Flat back."], substitutionReasons: ["heavier_strength","closest_match"], matchQuality: "excellent", intensityChange: "higher", difficultyChange: "same", recommendationRank: 2 },
      { name: "Inverted row supinated grip", movementPattern: "Supinated horizontal pull", primaryMuscles: ["lats","biceps","rear delts"], equipment: ["Pull-up bar"], difficulty: "beginner", impactLevel: "low", jointStressLevel: "low", formCues: ["Palms face toward you.", "Pull chest to bar.", "Lower fully."], substitutionReasons: ["easier","bodyweight","no_equipment","joint_friendly"], matchQuality: "good", intensityChange: "lower", difficultyChange: "easier", recommendationRank: 3 },
      { name: "Cable seated row supinated grip", movementPattern: "Supinated horizontal pull", primaryMuscles: ["lats","biceps","lower traps"], equipment: ["Cable machine"], difficulty: "beginner", impactLevel: "low", jointStressLevel: "low", formCues: ["Palms up grip.", "Pull to lower ribs.", "Tall spine."], substitutionReasons: ["joint_friendly","equipment_unavailable","easier"], matchQuality: "excellent", intensityChange: "same", difficultyChange: "easier", recommendationRank: 4 },
      { name: "Kettlebell reverse-grip bent-over row", movementPattern: "Supinated horizontal pull", primaryMuscles: ["lats","biceps","lower traps"], equipment: ["Kettlebells"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "moderate", formCues: ["Grip horns.", "Row to hips.", "Keep back flat."], substitutionReasons: ["equipment_unavailable","closest_match"], matchQuality: "excellent", intensityChange: "same", difficultyChange: "same", recommendationRank: 5 },
      { name: "Pendlay row supinated grip", movementPattern: "Supinated horizontal pull", primaryMuscles: ["lats","biceps","spinal erectors"], equipment: ["Barbell"], difficulty: "advanced", impactLevel: "low", jointStressLevel: "moderate", formCues: ["Bar reset on floor.", "Palms up.", "Explosive pull."], substitutionReasons: ["harder","heavier_strength","conditioning"], matchQuality: "good", intensityChange: "higher", difficultyChange: "harder", recommendationRank: 6, isAdvanced: true },
      { name: "Weighted chin-up", movementPattern: "Supinated vertical pull", primaryMuscles: ["lats","biceps","lower traps"], equipment: ["Pull-up bar","Dumbbells"], difficulty: "advanced", impactLevel: "low", jointStressLevel: "moderate", formCues: ["Add weight via belt or dumbbell.", "Full hang.", "Pull and lower slowly."], substitutionReasons: ["heavier_strength","harder"], matchQuality: "excellent", intensityChange: "higher", difficultyChange: "harder", recommendationRank: 7, isAdvanced: true },
    ],
  },

  // ─── 21. Side plank ───────────────────────────────────────────────────────
  {
    name: "Side plank",
    movementPattern: "Anti-lateral-flexion isometric",
    primaryMuscles: ["obliques", "gluteus medius", "shoulder stabilisers"],
    equipment: ["Bodyweight"],
    difficulty: "moderate",
    impactLevel: "low",
    jointStressLevel: "low",
    isCanonical: true,
    formCues: ["Elbow under shoulder.", "Lift hips high.", "Keep a straight line head to heel.", "Hold both sides equally."],
    substitutes: [
      { name: "Side plank with hip dip", movementPattern: "Anti-lateral-flexion dynamic", primaryMuscles: ["obliques","gluteus medius"], equipment: ["Bodyweight"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "low", formCues: ["Hold side plank.", "Lower hip to floor.", "Raise back up."], substitutionReasons: ["closest_match","harder"], matchQuality: "excellent", intensityChange: "higher", difficultyChange: "harder", recommendationRank: 1 },
      { name: "Suitcase hold", movementPattern: "Anti-lateral-flexion static", primaryMuscles: ["obliques","quadratus lumborum","grip"], equipment: ["Dumbbells","Kettlebells"], difficulty: "beginner", impactLevel: "low", jointStressLevel: "low", formCues: ["Stand holding weight one side.", "Don't lean.", "Hold the position."], substitutionReasons: ["easier","joint_friendly"], matchQuality: "good", intensityChange: "lower", difficultyChange: "easier", recommendationRank: 2 },
      { name: "Side plank with top-leg raise", movementPattern: "Anti-lateral-flexion with abduction", primaryMuscles: ["obliques","gluteus medius"], equipment: ["Bodyweight"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "low", formCues: ["Hold side plank.", "Raise top leg.", "Keep hips forward."], substitutionReasons: ["harder","closest_match"], matchQuality: "excellent", intensityChange: "higher", difficultyChange: "harder", recommendationRank: 3 },
      { name: "Copenhagen plank", movementPattern: "Anti-lateral-flexion isometric", primaryMuscles: ["obliques","adductors","gluteus medius"], equipment: ["Bodyweight","Adjustable bench"], difficulty: "advanced", impactLevel: "low", jointStressLevel: "moderate", formCues: ["Top foot on bench.", "Lift hips.", "Hold straight line."], substitutionReasons: ["harder"], matchQuality: "good", intensityChange: "higher", difficultyChange: "harder", recommendationRank: 4, isAdvanced: true, cautionNote: "High adductor demand. Move carefully." },
      { name: "Offset farmer's carry", movementPattern: "Anti-lateral-flexion locomotion", primaryMuscles: ["obliques","quadratus lumborum","grip"], equipment: ["Dumbbells","Kettlebells"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "low", formCues: ["Carry weight one side only.", "Walk tall.", "Switch sides each set."], substitutionReasons: ["conditioning","easier","joint_friendly"], matchQuality: "fair", intensityChange: "same", difficultyChange: "easier", recommendationRank: 5 },
      { name: "Kettlebell windmill", movementPattern: "Lateral hinge + rotation", primaryMuscles: ["obliques","glutes","shoulders"], equipment: ["Kettlebells"], difficulty: "advanced", impactLevel: "low", jointStressLevel: "moderate", formCues: ["Kettlebell pressed overhead.", "Hinge and rotate.", "Eye on the bell."], substitutionReasons: ["harder","conditioning"], matchQuality: "fair", intensityChange: "higher", difficultyChange: "harder", recommendationRank: 6, isAdvanced: true },
      { name: "Side plank row", movementPattern: "Anti-lateral-flexion + horizontal pull", primaryMuscles: ["obliques","lats","gluteus medius"], equipment: ["Dumbbells","Cable machine"], difficulty: "moderate", impactLevel: "low", jointStressLevel: "low", formCues: ["Hold side plank.", "Row with top arm.", "Stay stable."], substitutionReasons: ["harder","conditioning"], matchQuality: "good", intensityChange: "higher", difficultyChange: "harder", recommendationRank: 7 },
      { name: "Star plank", movementPattern: "Anti-lateral-flexion + rotation", primaryMuscles: ["obliques","gluteus medius","shoulders"], equipment: ["Bodyweight"], difficulty: "advanced", impactLevel: "low", jointStressLevel: "moderate", formCues: ["Side plank.", "Raise top arm and leg.", "Hold tight."], substitutionReasons: ["harder","bodyweight"], matchQuality: "good", intensityChange: "higher", difficultyChange: "harder", recommendationRank: 8, isAdvanced: true },
    ],
  },
];

export const DEFAULT_SAFETY_CUE = DEFAULT_SAFETY;

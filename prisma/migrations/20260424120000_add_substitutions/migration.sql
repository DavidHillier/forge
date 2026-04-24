-- Add equipment profile to User
ALTER TABLE "User" ADD COLUMN "equipmentProfile" JSONB NOT NULL DEFAULT '[]';

-- Add WorkoutSubstitution relation on WorkoutCompletion (back-ref only, no column)

-- CanonicalExercise catalogue
CREATE TABLE "CanonicalExercise" (
  "id"               TEXT NOT NULL,
  "name"             TEXT NOT NULL,
  "description"      TEXT NOT NULL DEFAULT '',
  "movementPattern"  TEXT NOT NULL,
  "primaryMuscles"   JSONB NOT NULL,
  "secondaryMuscles" JSONB NOT NULL DEFAULT '[]',
  "equipment"        JSONB NOT NULL,
  "difficulty"       TEXT NOT NULL,
  "impactLevel"      TEXT NOT NULL,
  "jointStressLevel" TEXT NOT NULL,
  "isCanonical"      BOOLEAN NOT NULL DEFAULT false,
  "formCues"         JSONB NOT NULL DEFAULT '[]',
  "safetyCue"        TEXT NOT NULL DEFAULT 'Stop if you feel sharp pain or dizziness.',
  "createdAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"        TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CanonicalExercise_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CanonicalExercise_name_key" ON "CanonicalExercise"("name");

-- ExerciseSubstitute relationships
CREATE TABLE "ExerciseSubstitute" (
  "id"                   TEXT NOT NULL,
  "canonicalExerciseId"  TEXT NOT NULL,
  "substituteExerciseId" TEXT NOT NULL,
  "substitutionReasons"  JSONB NOT NULL,
  "matchQuality"         TEXT NOT NULL,
  "intensityChange"      TEXT NOT NULL DEFAULT 'same',
  "difficultyChange"     TEXT NOT NULL DEFAULT 'same',
  "recommendationRank"   INTEGER NOT NULL DEFAULT 5,
  "scalingNote"          TEXT,
  "cautionNote"          TEXT,
  "isAdvanced"           BOOLEAN NOT NULL DEFAULT false,
  "createdAt"            TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"            TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ExerciseSubstitute_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ExerciseSubstitute_canonicalExerciseId_substituteExerciseId_key"
  ON "ExerciseSubstitute"("canonicalExerciseId", "substituteExerciseId");

CREATE INDEX "ExerciseSubstitute_canonicalExerciseId_idx"
  ON "ExerciseSubstitute"("canonicalExerciseId");

ALTER TABLE "ExerciseSubstitute"
  ADD CONSTRAINT "ExerciseSubstitute_canonicalExerciseId_fkey"
  FOREIGN KEY ("canonicalExerciseId") REFERENCES "CanonicalExercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ExerciseSubstitute"
  ADD CONSTRAINT "ExerciseSubstitute_substituteExerciseId_fkey"
  FOREIGN KEY ("substituteExerciseId") REFERENCES "CanonicalExercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- WorkoutSubstitution — user substitution choices per workout session
CREATE TABLE "WorkoutSubstitution" (
  "id"                      TEXT NOT NULL,
  "userId"                  TEXT NOT NULL,
  "workoutId"               TEXT NOT NULL,
  "workoutCompletionId"     TEXT,
  "originalExerciseName"    TEXT NOT NULL,
  "substitutedExerciseName" TEXT NOT NULL,
  "substitutionReason"      TEXT NOT NULL,
  "createdAt"               TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "WorkoutSubstitution_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "WorkoutSubstitution_userId_workoutId_idx"
  ON "WorkoutSubstitution"("userId", "workoutId");

ALTER TABLE "WorkoutSubstitution"
  ADD CONSTRAINT "WorkoutSubstitution_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "WorkoutSubstitution"
  ADD CONSTRAINT "WorkoutSubstitution_workoutId_fkey"
  FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "WorkoutSubstitution"
  ADD CONSTRAINT "WorkoutSubstitution_workoutCompletionId_fkey"
  FOREIGN KEY ("workoutCompletionId") REFERENCES "WorkoutCompletion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

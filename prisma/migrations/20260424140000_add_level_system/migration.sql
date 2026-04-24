-- AlterTable: User - add level tracking columns
ALTER TABLE "User" ADD COLUMN "currentLevel" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "User" ADD COLUMN "completedCircuitsThisLevel" INTEGER NOT NULL DEFAULT 0;

-- AlterTable: WorkoutCompletion - add hadFailures column
ALTER TABLE "WorkoutCompletion" ADD COLUMN "hadFailures" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable: Workout - add generatedWorkouts relation (no column needed, FK is on GeneratedWorkout)

-- CreateTable: GeneratedWorkout
CREATE TABLE "GeneratedWorkout" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workoutId" TEXT NOT NULL,
    "exercises" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GeneratedWorkout_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GeneratedWorkout_userId_workoutId_key" ON "GeneratedWorkout"("userId", "workoutId");
CREATE INDEX "GeneratedWorkout_userId_idx" ON "GeneratedWorkout"("userId");

-- AddForeignKey
ALTER TABLE "GeneratedWorkout" ADD CONSTRAINT "GeneratedWorkout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "GeneratedWorkout" ADD CONSTRAINT "GeneratedWorkout_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

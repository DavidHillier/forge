-- CreateTable
CREATE TABLE "ExerciseWeight" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workoutId" TEXT NOT NULL,
    "exerciseName" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "loggedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExerciseWeight_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ExerciseWeight_userId_exerciseName_idx" ON "ExerciseWeight"("userId", "exerciseName");

-- CreateIndex
CREATE INDEX "ExerciseWeight_userId_workoutId_idx" ON "ExerciseWeight"("userId", "workoutId");

-- AddForeignKey
ALTER TABLE "ExerciseWeight" ADD CONSTRAINT "ExerciseWeight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseWeight" ADD CONSTRAINT "ExerciseWeight_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

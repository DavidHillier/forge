CREATE TYPE "Units" AS ENUM ('metric', 'imperial');
CREATE TYPE "Phase" AS ENUM ('BUILD_UP', 'MAIN_COURSE');
CREATE TYPE "TrainingLoad" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "programmeStartDate" TIMESTAMP(3) NOT NULL,
  "units" "Units" NOT NULL DEFAULT 'metric',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Programme" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "totalWeeks" INTEGER NOT NULL,
  "totalDays" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Programme_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Week" (
  "id" TEXT NOT NULL,
  "programmeId" TEXT NOT NULL,
  "weekNumber" INTEGER NOT NULL,
  "phase" "Phase" NOT NULL,
  "title" TEXT NOT NULL,
  "theme" TEXT NOT NULL,
  "objective" TEXT NOT NULL,
  "circuitCount" INTEGER,
  "mainCourseWeekNumber" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Week_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Workout" (
  "id" TEXT NOT NULL,
  "weekId" TEXT NOT NULL,
  "dayNumber" INTEGER NOT NULL,
  "title" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "durationMinutes" INTEGER NOT NULL,
  "intensity" TEXT NOT NULL,
  "circuitCount" INTEGER,
  "equipment" JSONB NOT NULL,
  "description" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Workout_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "WorkoutBlock" (
  "id" TEXT NOT NULL,
  "workoutId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  "durationMinutes" INTEGER NOT NULL,
  "blockType" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "WorkoutBlock_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Exercise" (
  "id" TEXT NOT NULL,
  "workoutBlockId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  "workSeconds" INTEGER NOT NULL,
  "restSeconds" INTEGER NOT NULL,
  "rounds" INTEGER NOT NULL,
  "formCues" JSONB NOT NULL,
  "safetyCue" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "WorkoutCompletion" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "workoutId" TEXT NOT NULL,
  "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "totalSeconds" INTEGER NOT NULL,
  "circuitsCompleted" INTEGER NOT NULL,
  "roundsCompleted" INTEGER NOT NULL,
  "effortScore" INTEGER NOT NULL,
  "trainingLoad" "TrainingLoad" NOT NULL,
  "notes" TEXT,
  CONSTRAINT "WorkoutCompletion_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ReadinessCheck" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "workoutId" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "sleepQuality" TEXT NOT NULL,
  "soreness" TEXT NOT NULL,
  "energyLevel" TEXT NOT NULL,
  "timeAvailable" TEXT NOT NULL,
  "recommendation" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ReadinessCheck_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "BodyMetric" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "weight" DOUBLE PRECISION,
  "waist" DOUBLE PRECISION,
  "restingHeartRate" INTEGER,
  "note" TEXT,
  "progressPhotoUrl" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "BodyMetric_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "WeeklyReflection" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "weekNumber" INTEGER NOT NULL,
  "energy" INTEGER NOT NULL,
  "sleep" INTEGER NOT NULL,
  "soreness" INTEGER NOT NULL,
  "motivation" INTEGER NOT NULL,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "WeeklyReflection_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "UserConsent" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "privacyAcceptedAt" TIMESTAMP(3) NOT NULL,
  "termsAcceptedAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "UserConsent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DataExportRequest" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'requested',
  "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "completedAt" TIMESTAMP(3),
  CONSTRAINT "DataExportRequest_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Week_weekNumber_key" ON "Week"("weekNumber");
CREATE UNIQUE INDEX "Workout_weekId_dayNumber_key" ON "Workout"("weekId", "dayNumber");
CREATE INDEX "WorkoutCompletion_userId_completedAt_idx" ON "WorkoutCompletion"("userId", "completedAt");
CREATE UNIQUE INDEX "WeeklyReflection_userId_weekNumber_key" ON "WeeklyReflection"("userId", "weekNumber");

ALTER TABLE "Week" ADD CONSTRAINT "Week_programmeId_fkey" FOREIGN KEY ("programmeId") REFERENCES "Programme"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_weekId_fkey" FOREIGN KEY ("weekId") REFERENCES "Week"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WorkoutBlock" ADD CONSTRAINT "WorkoutBlock_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_workoutBlockId_fkey" FOREIGN KEY ("workoutBlockId") REFERENCES "WorkoutBlock"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WorkoutCompletion" ADD CONSTRAINT "WorkoutCompletion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WorkoutCompletion" ADD CONSTRAINT "WorkoutCompletion_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ReadinessCheck" ADD CONSTRAINT "ReadinessCheck_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ReadinessCheck" ADD CONSTRAINT "ReadinessCheck_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BodyMetric" ADD CONSTRAINT "BodyMetric_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WeeklyReflection" ADD CONSTRAINT "WeeklyReflection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserConsent" ADD CONSTRAINT "UserConsent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DataExportRequest" ADD CONSTRAINT "DataExportRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

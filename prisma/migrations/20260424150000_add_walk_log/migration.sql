-- CreateTable: WalkLog
CREATE TABLE "WalkLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "distanceKm" DOUBLE PRECISION NOT NULL,
    "loggedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WalkLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WalkLog_userId_idx" ON "WalkLog"("userId");

-- AddForeignKey
ALTER TABLE "WalkLog" ADD CONSTRAINT "WalkLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

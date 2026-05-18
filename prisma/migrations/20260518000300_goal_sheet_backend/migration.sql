DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'UnitOfMeasurement') THEN
    CREATE TYPE "UnitOfMeasurement" AS ENUM ('NUMERIC', 'PERCENTAGE', 'TIMELINE', 'ZERO_BASED');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Priority') THEN
    CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Quarter') THEN
    CREATE TYPE "Quarter" AS ENUM ('GOAL_SETTING', 'Q1', 'Q2', 'Q3', 'ANNUAL_REVIEW');
  END IF;
END $$;

ALTER TYPE "GoalStatus" ADD VALUE IF NOT EXISTS 'RETURNED_FOR_REWORK';
ALTER TYPE "GoalStatus" ADD VALUE IF NOT EXISTS 'LOCKED';

ALTER TABLE "Goal" ADD COLUMN IF NOT EXISTS "thrustArea" TEXT NOT NULL DEFAULT 'General';
ALTER TABLE "Goal" ADD COLUMN IF NOT EXISTS "unitOfMeasurement" "UnitOfMeasurement" NOT NULL DEFAULT 'NUMERIC';
ALTER TABLE "Goal" ADD COLUMN IF NOT EXISTS "startValue" DOUBLE PRECISION;
ALTER TABLE "Goal" ADD COLUMN IF NOT EXISTS "targetValue" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "Goal" ADD COLUMN IF NOT EXISTS "currentValue" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "Goal" ADD COLUMN IF NOT EXISTS "priority" "Priority" NOT NULL DEFAULT 'MEDIUM';
ALTER TABLE "Goal" ADD COLUMN IF NOT EXISTS "quarter" "Quarter" NOT NULL DEFAULT 'Q1';
ALTER TABLE "Goal" ADD COLUMN IF NOT EXISTS "cycleId" TEXT NOT NULL DEFAULT '2026';
ALTER TABLE "Goal" ADD COLUMN IF NOT EXISTS "startDate" TIMESTAMP(3);
ALTER TABLE "Goal" ADD COLUMN IF NOT EXISTS "dueDate" TIMESTAMP(3);
ALTER TABLE "Goal" ADD COLUMN IF NOT EXISTS "endDate" TIMESTAMP(3);
ALTER TABLE "Goal" ADD COLUMN IF NOT EXISTS "isShared" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Goal" ADD COLUMN IF NOT EXISTS "isLocked" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Goal" ADD COLUMN IF NOT EXISTS "primaryGoalId" TEXT;

UPDATE "Goal"
SET
  "targetValue" = "target",
  "currentValue" = "achievement",
  "isLocked" = "locked"
WHERE true;

UPDATE "Goal"
SET "cycleId" = '2026'
WHERE "cycleId" IS NULL OR "cycleId" = '';

CREATE INDEX IF NOT EXISTS "Goal_cycleId_idx" ON "Goal"("cycleId");
CREATE INDEX IF NOT EXISTS "Goal_primaryGoalId_idx" ON "Goal"("primaryGoalId");
CREATE INDEX IF NOT EXISTS "Goal_ownerId_idx" ON "Goal"("ownerId");
CREATE INDEX IF NOT EXISTS "Goal_status_idx" ON "Goal"("status");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Goal_primaryGoalId_fkey'
  ) THEN
    ALTER TABLE "Goal"
    ADD CONSTRAINT "Goal_primaryGoalId_fkey"
    FOREIGN KEY ("primaryGoalId") REFERENCES "Goal"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "SharedGoalParticipant" (
  "id" TEXT NOT NULL,
  "goalId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "linkedGoalId" TEXT,
  "canEdit" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "SharedGoalParticipant_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "SharedGoalParticipant_goalId_userId_key" ON "SharedGoalParticipant"("goalId", "userId");
CREATE UNIQUE INDEX IF NOT EXISTS "SharedGoalParticipant_linkedGoalId_key" ON "SharedGoalParticipant"("linkedGoalId");
CREATE INDEX IF NOT EXISTS "SharedGoalParticipant_userId_idx" ON "SharedGoalParticipant"("userId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'SharedGoalParticipant_goalId_fkey'
  ) THEN
    ALTER TABLE "SharedGoalParticipant"
    ADD CONSTRAINT "SharedGoalParticipant_goalId_fkey"
    FOREIGN KEY ("goalId") REFERENCES "Goal"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'SharedGoalParticipant_userId_fkey'
  ) THEN
    ALTER TABLE "SharedGoalParticipant"
    ADD CONSTRAINT "SharedGoalParticipant_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'SharedGoalParticipant_linkedGoalId_fkey'
  ) THEN
    ALTER TABLE "SharedGoalParticipant"
    ADD CONSTRAINT "SharedGoalParticipant_linkedGoalId_fkey"
    FOREIGN KEY ("linkedGoalId") REFERENCES "Goal"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "AuditLog" (
  "id" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "resource" TEXT NOT NULL,
  "resourceId" TEXT,
  "details" TEXT,
  "userId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "AuditLog_userId_idx" ON "AuditLog"("userId");
CREATE INDEX IF NOT EXISTS "AuditLog_resource_resourceId_idx" ON "AuditLog"("resource", "resourceId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'AuditLog_userId_fkey'
  ) THEN
    ALTER TABLE "AuditLog"
    ADD CONSTRAINT "AuditLog_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

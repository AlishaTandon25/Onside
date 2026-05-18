DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'GoalUpdateCadence') THEN
    CREATE TYPE "GoalUpdateCadence" AS ENUM ('WEEKLY', 'QUARTERLY');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "GoalUpdate" (
  "id" TEXT NOT NULL,
  "goalId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "cadence" "GoalUpdateCadence" NOT NULL DEFAULT 'WEEKLY',
  "previousValue" DOUBLE PRECISION NOT NULL,
  "newValue" DOUBLE PRECISION NOT NULL,
  "progressPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "accomplishments" JSONB NOT NULL DEFAULT '[]',
  "blockers" JSONB NOT NULL DEFAULT '[]',
  "nextSteps" JSONB NOT NULL DEFAULT '[]',
  "comment" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "GoalUpdate_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "GoalUpdate" ADD COLUMN IF NOT EXISTS "cadence" "GoalUpdateCadence" NOT NULL DEFAULT 'WEEKLY';
ALTER TABLE "GoalUpdate" ADD COLUMN IF NOT EXISTS "progressPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "GoalUpdate" ADD COLUMN IF NOT EXISTS "accomplishments" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "GoalUpdate" ADD COLUMN IF NOT EXISTS "blockers" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "GoalUpdate" ADD COLUMN IF NOT EXISTS "nextSteps" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "GoalUpdate" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE INDEX IF NOT EXISTS "GoalUpdate_goalId_idx" ON "GoalUpdate"("goalId");
CREATE INDEX IF NOT EXISTS "GoalUpdate_userId_idx" ON "GoalUpdate"("userId");
CREATE INDEX IF NOT EXISTS "GoalUpdate_cadence_idx" ON "GoalUpdate"("cadence");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'GoalUpdate_goalId_fkey'
  ) THEN
    ALTER TABLE "GoalUpdate"
    ADD CONSTRAINT "GoalUpdate_goalId_fkey"
    FOREIGN KEY ("goalId") REFERENCES "Goal"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'GoalUpdate_userId_fkey'
  ) THEN
    ALTER TABLE "GoalUpdate"
    ADD CONSTRAINT "GoalUpdate_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

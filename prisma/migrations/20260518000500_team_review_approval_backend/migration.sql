CREATE TABLE IF NOT EXISTS "GoalApproval" (
  "id" TEXT NOT NULL,
  "goalId" TEXT NOT NULL,
  "managerId" TEXT NOT NULL,
  "status" "GoalStatus" NOT NULL,
  "comment" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "GoalApproval_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "GoalApproval_goalId_idx" ON "GoalApproval"("goalId");
CREATE INDEX IF NOT EXISTS "GoalApproval_managerId_idx" ON "GoalApproval"("managerId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'GoalApproval_goalId_fkey'
  ) THEN
    ALTER TABLE "GoalApproval"
    ADD CONSTRAINT "GoalApproval_goalId_fkey"
    FOREIGN KEY ("goalId") REFERENCES "Goal"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'GoalApproval_managerId_fkey'
  ) THEN
    ALTER TABLE "GoalApproval"
    ADD CONSTRAINT "GoalApproval_managerId_fkey"
    FOREIGN KEY ("managerId") REFERENCES "User"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'NotificationType') THEN
    CREATE TYPE "NotificationType" AS ENUM (
      'GOAL_ASSIGNED',
      'GOAL_UPDATED',
      'APPROVAL_REQUIRED',
      'ESCALATION',
      'SYSTEM'
    );
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "Notification" (
  "id" TEXT NOT NULL,
  "type" "NotificationType" NOT NULL,
  "message" TEXT NOT NULL,
  "read" BOOLEAN NOT NULL DEFAULT false,
  "userId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "Notification_userId_idx" ON "Notification"("userId");
CREATE INDEX IF NOT EXISTS "Notification_read_idx" ON "Notification"("read");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Notification_userId_fkey'
  ) THEN
    ALTER TABLE "Notification"
    ADD CONSTRAINT "Notification_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "Department" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Department_name_key" ON "Department"("name");

INSERT INTO "Department" ("id", "name", "description")
VALUES
    ('dept_hr', 'HR', 'Human Resources'),
    ('dept_sales', 'Sales', 'Direct sales and account management'),
    ('dept_engineering', 'Engineering', 'Product development')
ON CONFLICT ("name") DO NOTHING;

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "emailVerified" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "image" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "departmentId" TEXT;

UPDATE "User"
SET "emailVerified" = CURRENT_TIMESTAMP
WHERE "emailVerified" IS NULL AND "passwordHash" IS NOT NULL;

UPDATE "User" AS users
SET "departmentId" = departments."id"
FROM "Department" AS departments
WHERE users."departmentId" IS NULL
  AND users."department" IS NOT NULL
  AND lower(departments."name") = lower(users."department");

CREATE INDEX IF NOT EXISTS "User_departmentId_idx" ON "User"("departmentId");
CREATE INDEX IF NOT EXISTS "User_managerId_idx" ON "User"("managerId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'User_departmentId_fkey'
  ) THEN
    ALTER TABLE "User"
    ADD CONSTRAINT "User_departmentId_fkey"
    FOREIGN KEY ("departmentId") REFERENCES "Department"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

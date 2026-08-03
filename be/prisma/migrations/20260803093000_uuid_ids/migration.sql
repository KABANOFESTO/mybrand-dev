-- Enable UUID generation in PostgreSQL.
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing foreign keys and UUID-sensitive indexes before changing column types.
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";
ALTER TABLE "Project" DROP CONSTRAINT "Project_ownerId_fkey";
ALTER TABLE "ContactMessage" DROP CONSTRAINT "ContactMessage_userId_fkey";
ALTER TABLE "AiReport" DROP CONSTRAINT "AiReport_userId_fkey";
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_userId_fkey";
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";
ALTER TABLE "AnalyticsEvent" DROP CONSTRAINT "AnalyticsEvent_userId_fkey";
ALTER TABLE "InterviewSession" DROP CONSTRAINT "InterviewSession_userId_fkey";
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_userId_fkey";

DROP INDEX IF EXISTS "Profile_userId_key";

-- Convert primary keys and relation columns to UUID.
ALTER TABLE "User" ALTER COLUMN "id" TYPE UUID USING ("id"::uuid);
ALTER TABLE "Profile" ALTER COLUMN "id" TYPE UUID USING ("id"::uuid);
ALTER TABLE "Profile" ALTER COLUMN "userId" TYPE UUID USING ("userId"::uuid);
ALTER TABLE "Project" ALTER COLUMN "id" TYPE UUID USING ("id"::uuid);
ALTER TABLE "Project" ALTER COLUMN "ownerId" TYPE UUID USING ("ownerId"::uuid);
ALTER TABLE "Certificate" ALTER COLUMN "id" TYPE UUID USING ("id"::uuid);
ALTER TABLE "Skill" ALTER COLUMN "id" TYPE UUID USING ("id"::uuid);
ALTER TABLE "Experience" ALTER COLUMN "id" TYPE UUID USING ("id"::uuid);
ALTER TABLE "Education" ALTER COLUMN "id" TYPE UUID USING ("id"::uuid);
ALTER TABLE "ContactMessage" ALTER COLUMN "id" TYPE UUID USING ("id"::uuid);
ALTER TABLE "ContactMessage" ALTER COLUMN "userId" TYPE UUID USING ("userId"::uuid);
ALTER TABLE "AiReport" ALTER COLUMN "id" TYPE UUID USING ("id"::uuid);
ALTER TABLE "AiReport" ALTER COLUMN "userId" TYPE UUID USING ("userId"::uuid);
ALTER TABLE "Payment" ALTER COLUMN "id" TYPE UUID USING ("id"::uuid);
ALTER TABLE "Payment" ALTER COLUMN "userId" TYPE UUID USING ("userId"::uuid);
ALTER TABLE "Notification" ALTER COLUMN "id" TYPE UUID USING ("id"::uuid);
ALTER TABLE "Notification" ALTER COLUMN "userId" TYPE UUID USING ("userId"::uuid);
ALTER TABLE "AnalyticsEvent" ALTER COLUMN "id" TYPE UUID USING ("id"::uuid);
ALTER TABLE "AnalyticsEvent" ALTER COLUMN "userId" TYPE UUID USING ("userId"::uuid);
ALTER TABLE "InterviewSession" ALTER COLUMN "id" TYPE UUID USING ("id"::uuid);
ALTER TABLE "InterviewSession" ALTER COLUMN "userId" TYPE UUID USING ("userId"::uuid);
ALTER TABLE "RefreshToken" ALTER COLUMN "id" TYPE UUID USING ("id"::uuid);
ALTER TABLE "RefreshToken" ALTER COLUMN "userId" TYPE UUID USING ("userId"::uuid);

-- Apply UUID defaults for future inserts.
ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "Profile" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "Project" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "Certificate" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "Skill" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "Experience" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "Education" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "ContactMessage" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "AiReport" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "Payment" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "Notification" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "AnalyticsEvent" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "InterviewSession" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "RefreshToken" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- Add the missing refresh token identifier used by auth session rotation.
ALTER TABLE "RefreshToken" ADD COLUMN "jti" TEXT;
UPDATE "RefreshToken" SET "jti" = gen_random_uuid()::text WHERE "jti" IS NULL;
ALTER TABLE "RefreshToken" ALTER COLUMN "jti" SET NOT NULL;

-- Restore uniqueness and foreign keys.
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");
CREATE UNIQUE INDEX "RefreshToken_jti_key" ON "RefreshToken"("jti");

ALTER TABLE "Profile"
  ADD CONSTRAINT "Profile_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Project"
  ADD CONSTRAINT "Project_ownerId_fkey"
  FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ContactMessage"
  ADD CONSTRAINT "ContactMessage_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "AiReport"
  ADD CONSTRAINT "AiReport_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Payment"
  ADD CONSTRAINT "Payment_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Notification"
  ADD CONSTRAINT "Notification_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "AnalyticsEvent"
  ADD CONSTRAINT "AnalyticsEvent_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "InterviewSession"
  ADD CONSTRAINT "InterviewSession_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "RefreshToken"
  ADD CONSTRAINT "RefreshToken_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

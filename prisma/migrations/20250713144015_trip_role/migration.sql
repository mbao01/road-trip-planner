/*
  Warnings:

  - The values [ACTIVE] on the enum `TripStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TripStatus_new" AS ENUM ('ARCHIVED', 'DELETED', 'COMPLETED', 'IN_PROGRESS', 'NOT_STARTED');
ALTER TABLE "Trip" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Trip" ALTER COLUMN "status" TYPE "TripStatus_new" USING ("status"::text::"TripStatus_new");
ALTER TYPE "TripStatus" RENAME TO "TripStatus_old";
ALTER TYPE "TripStatus_new" RENAME TO "TripStatus";
DROP TYPE "TripStatus_old";
ALTER TABLE "Trip" ALTER COLUMN "status" SET DEFAULT 'NOT_STARTED';
COMMIT;

-- AlterTable
ALTER TABLE "Trip" ALTER COLUMN "status" SET DEFAULT 'NOT_STARTED';

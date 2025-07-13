-- CreateEnum
CREATE TYPE "TripAccess" AS ENUM ('PRIVATE', 'PUBLIC');

-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "access" "TripAccess" NOT NULL DEFAULT 'PRIVATE';

/*
  Warnings:

  - You are about to drop the column `role` on the `Collaborator` table. All the data in the column will be lost.
  - Added the required column `tripRole` to the `Collaborator` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TripRole" AS ENUM ('OWNER', 'EDITOR', 'VIEWER', 'PUBLIC');

-- AlterTable
ALTER TABLE "Collaborator" DROP COLUMN "role",
ADD COLUMN     "tripRole" "TripRole" NOT NULL;

-- DropEnum
DROP TYPE "Role";

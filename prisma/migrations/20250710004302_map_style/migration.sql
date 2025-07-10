/*
  Warnings:

  - The `mapStyle` column on the `Settings` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `mode` to the `Travel` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TravelMode" AS ENUM ('DRIVING', 'WALKING', 'BICYCLING', 'TRANSIT');

-- CreateEnum
CREATE TYPE "MapStyle" AS ENUM ('DEFAULT', 'ROADMAP', 'SATELLITE', 'HYBRID', 'TERRAIN');

-- AlterTable
ALTER TABLE "Settings" DROP COLUMN "mapStyle",
ADD COLUMN     "mapStyle" "MapStyle" DEFAULT 'DEFAULT';

-- AlterTable
ALTER TABLE "Travel" ADD COLUMN     "mode" "TravelMode" NOT NULL;

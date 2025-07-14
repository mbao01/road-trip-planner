/*
  Warnings:

  - A unique constraint covering the columns `[tripId,email]` on the table `TripInvite` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TripInvite_tripId_email_key" ON "TripInvite"("tripId", "email");

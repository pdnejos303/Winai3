/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Routine` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Routine` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Routine` table. All the data in the column will be lost.
  - Added the required column `startAt` to the `Routine` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Routine" DROP COLUMN "createdAt",
DROP COLUMN "startTime",
DROP COLUMN "updatedAt",
ADD COLUMN     "startAt" TIMESTAMP(3) NOT NULL;

/*
  Warnings:

  - You are about to drop the column `address` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `slot` on the `Activity` table. All the data in the column will be lost.
  - Added the required column `dateId` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endsAt` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slots` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startsAt` to the `Activity` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ActivityLocation" AS ENUM ('MAIN', 'LATERAL', 'WORKSHOP');

-- CreateEnum
CREATE TYPE "WeekDays" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "Month" AS ENUM ('JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER');

-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "address",
DROP COLUMN "slot",
ADD COLUMN     "dateId" INTEGER NOT NULL,
ADD COLUMN     "endsAt" INTEGER NOT NULL,
ADD COLUMN     "location" "ActivityLocation" NOT NULL,
ADD COLUMN     "slots" INTEGER NOT NULL,
ADD COLUMN     "startsAt" INTEGER NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "ActivityDate" (
    "id" SERIAL NOT NULL,
    "weekDay" "WeekDays" NOT NULL,
    "monthDay" INTEGER NOT NULL,
    "month" "Month" NOT NULL,

    CONSTRAINT "ActivityDate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_dateId_fkey" FOREIGN KEY ("dateId") REFERENCES "ActivityDate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

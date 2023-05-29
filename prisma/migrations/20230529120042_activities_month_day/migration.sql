/*
  Warnings:

  - Added the required column `monthDay` to the `ActivityDate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ActivityDate" ADD COLUMN     "monthDay" INTEGER NOT NULL;

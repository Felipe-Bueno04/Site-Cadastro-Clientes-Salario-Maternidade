/*
  Warnings:

  - A unique constraint covering the columns `[adminCode]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "adminCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_adminCode_key" ON "User"("adminCode");

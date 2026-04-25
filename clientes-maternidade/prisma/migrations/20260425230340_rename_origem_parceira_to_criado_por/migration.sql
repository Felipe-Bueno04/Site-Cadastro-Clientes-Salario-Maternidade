/*
  Warnings:

  - You are about to drop the column `origemParceira` on the `Cliente` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Cliente" DROP COLUMN "origemParceira",
ADD COLUMN     "criadoPor" TEXT;

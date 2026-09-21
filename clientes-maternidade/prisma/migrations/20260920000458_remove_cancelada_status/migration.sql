/*
  Warnings:

  - The values [CANCELADA] on the enum `StatusCliente` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `Pagamento` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Pagamento` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - The required column `idPagamento` was added to the `Pagamento` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `idUser` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StatusCliente_new" AS ENUM ('ATIVA', 'INATIVA', 'FINALIZADA');
ALTER TABLE "Cliente" ALTER COLUMN "statusCliente" TYPE "StatusCliente_new" USING ("statusCliente"::text::"StatusCliente_new");
ALTER TYPE "StatusCliente" RENAME TO "StatusCliente_old";
ALTER TYPE "StatusCliente_new" RENAME TO "StatusCliente";
DROP TYPE "public"."StatusCliente_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Cliente" DROP CONSTRAINT "Cliente_adminId_fkey";

-- DropForeignKey
ALTER TABLE "Pagamento" DROP CONSTRAINT "Pagamento_clienteId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_adminId_fkey";

-- AlterTable
ALTER TABLE "Pagamento" DROP CONSTRAINT "Pagamento_pkey",
DROP COLUMN "id",
ADD COLUMN     "idPagamento" TEXT NOT NULL,
ALTER COLUMN "clienteId" DROP NOT NULL,
ADD CONSTRAINT "Pagamento_pkey" PRIMARY KEY ("idPagamento");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "idUser" TEXT NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("idUser");

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("idUser") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pagamento" ADD CONSTRAINT "Pagamento_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("idCliente") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("idUser") ON DELETE SET NULL ON UPDATE CASCADE;

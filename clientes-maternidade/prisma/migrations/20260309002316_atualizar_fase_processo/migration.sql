/*
  Warnings:

  - The values [AGUARDANDO_CONTRATO] on the enum `FaseProcesso` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FaseProcesso_new" AS ENUM ('CADASTRO', 'ANALISE_DOCUMENTOS', 'CONTRATO_ENVIADO', 'AGUARDANDO_ASSINATURA', 'PROCESSO_ENVIADO_INSS', 'PROCESSO_FINALIZADO');
ALTER TABLE "Cliente" ALTER COLUMN "faseProcesso" TYPE "FaseProcesso_new" USING ("faseProcesso"::text::"FaseProcesso_new");
ALTER TYPE "FaseProcesso" RENAME TO "FaseProcesso_old";
ALTER TYPE "FaseProcesso_new" RENAME TO "FaseProcesso";
DROP TYPE "public"."FaseProcesso_old";
COMMIT;

-- AlterTable
ALTER TABLE "Cliente" ALTER COLUMN "email" DROP NOT NULL;

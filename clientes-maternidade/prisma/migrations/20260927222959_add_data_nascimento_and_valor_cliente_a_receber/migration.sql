-- AlterTable
ALTER TABLE "Cliente" ADD COLUMN     "dataNascimento" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Pagamento" ADD COLUMN     "valorClienteAReceber" DOUBLE PRECISION;

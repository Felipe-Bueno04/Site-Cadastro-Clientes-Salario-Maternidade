-- CreateEnum
CREATE TYPE "StatusPagamento" AS ENUM ('PENDENTE', 'PAGO', 'ATRASADO', 'CANCELADO');

-- CreateTable
CREATE TABLE "Pagamento" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "dataVencimento" TIMESTAMP(3) NOT NULL,
    "dataPagamento" TIMESTAMP(3),
    "status" "StatusPagamento" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pagamento_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Pagamento" ADD CONSTRAINT "Pagamento_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("idCliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "StatusCliente" AS ENUM ('ATIVA', 'INATIVA', 'FINALIZADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "FaseProcesso" AS ENUM ('CADASTRO', 'ANALISE_DOCUMENTOS', 'CONTRATO_ENVIADO', 'AGUARDANDO_ASSINATURA', 'PROCESSO_ENVIADO_INSS', 'PROCESSO_FINALIZADO');

-- CreateEnum
CREATE TYPE "StatusContrato" AS ENUM ('NAO_ENVIADO', 'ENVIADO', 'ASSINADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "StatusNascimento" AS ENUM ('AGUARDANDO', 'NASCEU', 'NAO_INFORMADO');

-- CreateEnum
CREATE TYPE "StatusPagamento" AS ENUM ('PENDENTE', 'PAGO', 'ATRASADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'PARCEIRO');

-- CreateTable
CREATE TABLE "Cliente" (
    "idCliente" TEXT NOT NULL,
    "nomeCompleto" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "email" TEXT,
    "instagram" TEXT,
    "origemParceira" TEXT,
    "recebeBolsaFamilia" BOOLEAN NOT NULL,
    "tempoGestacaoSemanas" INTEGER,
    "dataProvavelParto" TIMESTAMP(3),
    "mesParto" INTEGER,
    "anoParto" INTEGER,
    "possuiSenhaGov" BOOLEAN NOT NULL,
    "senhaGov" TEXT,
    "observacoes" TEXT,
    "statusCliente" "StatusCliente" NOT NULL,
    "faseProcesso" "FaseProcesso" NOT NULL,
    "statusContrato" "StatusContrato" NOT NULL,
    "statusNascimento" "StatusNascimento" NOT NULL,
    "dataCadastro" TIMESTAMP(3) NOT NULL,
    "dataEnvioContrato" TIMESTAMP(3),
    "dataAssinatura" TIMESTAMP(3),
    "alertaParto30Dias" BOOLEAN NOT NULL DEFAULT false,
    "alertaParto15Dias" BOOLEAN NOT NULL DEFAULT false,
    "adminId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("idCliente")
);

-- CreateTable
CREATE TABLE "Pagamento" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "dataVencimento" TIMESTAMP(3) NOT NULL,
    "dataPagamento" TIMESTAMP(3),
    "status" "StatusPagamento" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "descricao" TEXT,
    "formaPagamento" TEXT,
    "parcela" INTEGER,
    "totalParcelas" INTEGER,

    CONSTRAINT "Pagamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'PARCEIRO',
    "adminId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pagamento" ADD CONSTRAINT "Pagamento_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("idCliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

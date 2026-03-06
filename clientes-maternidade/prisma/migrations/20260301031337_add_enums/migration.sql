-- CreateEnum
CREATE TYPE "StatusCliente" AS ENUM ('ATIVA', 'INATIVA', 'FINALIZADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "FaseProcesso" AS ENUM ('CADASTRO', 'ANALISE_DOCUMENTOS', 'AGUARDANDO_CONTRATO', 'CONTRATO_ENVIADO', 'AGUARDANDO_ASSINATURA', 'PROCESSO_FINALIZADO');

-- CreateEnum
CREATE TYPE "StatusContrato" AS ENUM ('NAO_ENVIADO', 'ENVIADO', 'ASSINADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "StatusNascimento" AS ENUM ('AGUARDANDO', 'NASCEU', 'NAO_INFORMADO');

-- CreateTable
CREATE TABLE "Cliente" (
    "idCliente" TEXT NOT NULL,
    "nomeCompleto" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "instagram" TEXT,
    "origemParceira" TEXT,
    "recebeBolsaFamilia" BOOLEAN NOT NULL,
    "tempoGestacaoSemanas" INTEGER,
    "dataProvavelParto" TIMESTAMP(3),
    "mesParto" INTEGER,
    "anoParto" INTEGER,
    "possuiSenhaGov" BOOLEAN NOT NULL,
    "senhaGov" TEXT,
    "statusCliente" "StatusCliente" NOT NULL,
    "faseProcesso" "FaseProcesso" NOT NULL,
    "statusContrato" "StatusContrato" NOT NULL,
    "statusNascimento" "StatusNascimento" NOT NULL,
    "dataCadastro" TIMESTAMP(3) NOT NULL,
    "dataEnvioContrato" TIMESTAMP(3),
    "dataAssinatura" TIMESTAMP(3),
    "alertaParto30Dias" BOOLEAN NOT NULL DEFAULT false,
    "alertaParto15Dias" BOOLEAN NOT NULL DEFAULT false,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("idCliente")
);

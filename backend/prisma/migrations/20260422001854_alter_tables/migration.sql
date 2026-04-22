/*
  Warnings:

  - You are about to drop the column `identificador` on the `Usuarios` table. All the data in the column will be lost.
  - Added the required column `observacao` to the `Historico_Eventos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `setor_afetado` to the `Historico_Eventos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_setor` to the `OrdemProducao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `observacao_op` to the `OrdemProducao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prioridade` to the `OrdemProducao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status_op` to the `OrdemProducao` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TipoPrioridade" AS ENUM ('Alta', 'Media', 'Baixa', 'Critica');

-- AlterEnum
ALTER TYPE "StatusMaquina" ADD VALUE 'Aguardando';

-- DropIndex
DROP INDEX "Usuarios_identificador_key";

-- AlterTable
ALTER TABLE "Historico_Eventos" ADD COLUMN     "observacao" VARCHAR(450) NOT NULL,
ADD COLUMN     "setor_afetado" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "OrdemProducao" ADD COLUMN     "id_setor" INTEGER NOT NULL,
ADD COLUMN     "observacao_op" VARCHAR(450) NOT NULL,
ADD COLUMN     "prioridade" "TipoPrioridade" NOT NULL,
ADD COLUMN     "status_op" "StatusMaquina" NOT NULL;

-- AlterTable
ALTER TABLE "Usuarios" DROP COLUMN "identificador",
ALTER COLUMN "id_usuario" DROP DEFAULT;
DROP SEQUENCE "Usuarios_id_usuario_seq";

-- CreateTable
CREATE TABLE "Logs" (
    "id_log" SERIAL NOT NULL,
    "usuario_id" INTEGER,
    "rota" VARCHAR(255) NOT NULL,
    "metodo" VARCHAR(10) NOT NULL,
    "status_code" INTEGER,
    "ip_address" VARCHAR(45),
    "user_agent" VARCHAR(500),
    "tempo_resposta_ms" INTEGER,
    "dados_requisicao" TEXT,
    "dados_resposta" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Logs_pkey" PRIMARY KEY ("id_log")
);

-- CreateTable
CREATE TABLE "_OrdemProducaoToSetores" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_OrdemProducaoToSetores_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "Logs_usuario_id_idx" ON "Logs"("usuario_id");

-- CreateIndex
CREATE INDEX "Logs_rota_idx" ON "Logs"("rota");

-- CreateIndex
CREATE INDEX "Logs_status_code_idx" ON "Logs"("status_code");

-- CreateIndex
CREATE INDEX "Logs_criado_em_idx" ON "Logs"("criado_em");

-- CreateIndex
CREATE INDEX "_OrdemProducaoToSetores_B_index" ON "_OrdemProducaoToSetores"("B");

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuarios"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrdemProducaoToSetores" ADD CONSTRAINT "_OrdemProducaoToSetores_A_fkey" FOREIGN KEY ("A") REFERENCES "OrdemProducao"("id_ordem") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrdemProducaoToSetores" ADD CONSTRAINT "_OrdemProducaoToSetores_B_fkey" FOREIGN KEY ("B") REFERENCES "Setores"("id_setor") ON DELETE CASCADE ON UPDATE CASCADE;

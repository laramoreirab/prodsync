/*
  Warnings:

  - Added the required column `id_empresa` to the `EscalaTrabalho` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EscalaTrabalho" ADD COLUMN     "id_empresa" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "Apontamento_id_empresa_idx" ON "Apontamento"("id_empresa");

-- CreateIndex
CREATE INDEX "Historico_Eventos_id_empresa_idx" ON "Historico_Eventos"("id_empresa");

-- AddForeignKey
ALTER TABLE "EscalaTrabalho" ADD CONSTRAINT "EscalaTrabalho_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "Empresas"("id_empresa") ON DELETE CASCADE ON UPDATE CASCADE;

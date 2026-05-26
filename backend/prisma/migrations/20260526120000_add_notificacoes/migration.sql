-- CreateEnum
CREATE TYPE "TipoNotificacao" AS ENUM ('Maquina_Parada', 'Maquina_Setup', 'Solicitar_Justificativa');

-- CreateTable
CREATE TABLE "Notificacoes" (
    "id_notificacao" SERIAL NOT NULL,
    "id_empresa" INTEGER NOT NULL,
    "id_destinatario" INTEGER NOT NULL,
    "tipo" "TipoNotificacao" NOT NULL,
    "titulo" VARCHAR(255) NOT NULL,
    "mensagem" VARCHAR(500) NOT NULL,
    "id_evento" INTEGER,
    "id_maquina" INTEGER,
    "lida" BOOLEAN NOT NULL DEFAULT false,
    "lida_em" TIMESTAMP(3),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notificacoes_pkey" PRIMARY KEY ("id_notificacao")
);

-- CreateIndex
CREATE INDEX "Notificacoes_id_destinatario_lida_idx" ON "Notificacoes"("id_destinatario", "lida");

-- CreateIndex
CREATE INDEX "Notificacoes_id_empresa_idx" ON "Notificacoes"("id_empresa");

-- AddForeignKey
ALTER TABLE "Notificacoes" ADD CONSTRAINT "Notificacoes_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "Empresas"("id_empresa") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notificacoes" ADD CONSTRAINT "Notificacoes_id_destinatario_fkey" FOREIGN KEY ("id_destinatario") REFERENCES "Usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notificacoes" ADD CONSTRAINT "Notificacoes_id_evento_fkey" FOREIGN KEY ("id_evento") REFERENCES "Historico_Eventos"("id_evento") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notificacoes" ADD CONSTRAINT "Notificacoes_id_maquina_fkey" FOREIGN KEY ("id_maquina") REFERENCES "Maquinas"("id_maquina") ON DELETE SET NULL ON UPDATE CASCADE;

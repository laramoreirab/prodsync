-- CreateEnum
CREATE TYPE "TipoUsuario" AS ENUM ('Adm', 'Gestor', 'Operador');

-- CreateEnum
CREATE TYPE "StatusMaquina" AS ENUM ('Produzindo', 'Parada', 'Manutencao', 'Setup');

-- CreateEnum
CREATE TYPE "DiaSemana" AS ENUM ('Domingo', 'Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado');

-- CreateEnum
CREATE TYPE "TipoMotivoParada" AS ENUM ('Programada', 'Nao Programada');

-- CreateTable
CREATE TABLE "Empresas" (
    "id_empresa" SERIAL NOT NULL,
    "nome_empresa" VARCHAR(255) NOT NULL,
    "cnpj" VARCHAR(18) NOT NULL,
    "data_cadastro" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "email" VARCHAR(255),
    "telefone" VARCHAR(20),
    "endereco" VARCHAR(255),
    "cpf_representante" VARCHAR(14),

    CONSTRAINT "Empresas_pkey" PRIMARY KEY ("id_empresa")
);

-- CreateTable
CREATE TABLE "Usuarios" (
    "id_usuario" SERIAL NOT NULL,
    "id_empresa" INTEGER NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "identificador" VARCHAR(50) NOT NULL,
    "tipo" "TipoUsuario" NOT NULL,
    "cpf" VARCHAR(14) NOT NULL,
    "email" VARCHAR(255),

    CONSTRAINT "Usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "Setores" (
    "id_setor" SERIAL NOT NULL,
    "id_empresa" INTEGER NOT NULL,
    "nome_setor" VARCHAR(100) NOT NULL,

    CONSTRAINT "Setores_pkey" PRIMARY KEY ("id_setor")
);

-- CreateTable
CREATE TABLE "Categoria_Maquina" (
    "id_categoria" SERIAL NOT NULL,
    "id_empresa" INTEGER NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "descricao" TEXT,

    CONSTRAINT "Categoria_Maquina_pkey" PRIMARY KEY ("id_categoria")
);

-- CreateTable
CREATE TABLE "Maquinas" (
    "id_maquina" SERIAL NOT NULL,
    "id_empresa" INTEGER NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "serie" VARCHAR(50),
    "status_atual" "StatusMaquina" NOT NULL DEFAULT 'Parada',
    "id_setor" INTEGER NOT NULL,
    "id_categoria" INTEGER NOT NULL,
    "data_ativacao" DATE,

    CONSTRAINT "Maquinas_pkey" PRIMARY KEY ("id_maquina")
);

-- CreateTable
CREATE TABLE "Setor_Gestor" (
    "id_setor" INTEGER NOT NULL,
    "id_gestor" INTEGER NOT NULL,
    "id_empresa" INTEGER NOT NULL,

    CONSTRAINT "Setor_Gestor_pkey" PRIMARY KEY ("id_setor","id_gestor")
);

-- CreateTable
CREATE TABLE "Turno" (
    "id_turno" SERIAL NOT NULL,
    "id_empresa" INTEGER NOT NULL,
    "nome_turno" VARCHAR(50) NOT NULL,
    "hora_inicio" TIME NOT NULL,
    "hora_fim" TIME NOT NULL,

    CONSTRAINT "Turno_pkey" PRIMARY KEY ("id_turno")
);

-- CreateTable
CREATE TABLE "EscalaTrabalho" (
    "id_operador" INTEGER NOT NULL,
    "id_turno" INTEGER NOT NULL,
    "dia_semana" "DiaSemana" NOT NULL,

    CONSTRAINT "EscalaTrabalho_pkey" PRIMARY KEY ("id_operador","id_turno","dia_semana")
);

-- CreateTable
CREATE TABLE "Motivos_Parada" (
    "id_motivo" SERIAL NOT NULL,
    "id_empresa" INTEGER NOT NULL,
    "descricao" VARCHAR(255) NOT NULL,
    "tipo" "TipoMotivoParada" NOT NULL DEFAULT 'Nao Programada',

    CONSTRAINT "Motivos_Parada_pkey" PRIMARY KEY ("id_motivo")
);

-- CreateTable
CREATE TABLE "OrdemProducao" (
    "id_ordem" SERIAL NOT NULL,
    "id_empresa" INTEGER NOT NULL,
    "id_maquina" INTEGER NOT NULL,
    "codigo_lote" VARCHAR(100) NOT NULL,
    "produto" VARCHAR(150) NOT NULL,
    "data_inicio" TIMESTAMP(3),
    "data_fim" TIMESTAMP(3),
    "qtd_planejada" INTEGER NOT NULL,

    CONSTRAINT "OrdemProducao_pkey" PRIMARY KEY ("id_ordem")
);

-- CreateTable
CREATE TABLE "Historico_Eventos" (
    "id_evento" SERIAL NOT NULL,
    "id_empresa" INTEGER NOT NULL,
    "id_maquina" INTEGER NOT NULL,
    "id_ordemProducao" INTEGER,
    "id_turno" INTEGER NOT NULL,
    "id_motivo_parada" INTEGER,
    "status_atual" "StatusMaquina" NOT NULL,
    "inicio" TIMESTAMP(3) NOT NULL,
    "termino" TIMESTAMP(3),
    "duracao" INTEGER,

    CONSTRAINT "Historico_Eventos_pkey" PRIMARY KEY ("id_evento")
);

-- CreateTable
CREATE TABLE "Apontamento" (
    "id_apontamento" SERIAL NOT NULL,
    "id_empresa" INTEGER NOT NULL,
    "id_ordemProducao" INTEGER NOT NULL,
    "id_maquina" INTEGER NOT NULL,
    "id_operador" INTEGER NOT NULL,
    "id_turno" INTEGER NOT NULL,
    "qtd_boa" INTEGER NOT NULL DEFAULT 0,
    "qtd_refugo" INTEGER NOT NULL DEFAULT 0,
    "data_hora_inicio" TIMESTAMP(3) NOT NULL,
    "data_hora_fim" TIMESTAMP(3) NOT NULL,
    "observacao" TEXT,

    CONSTRAINT "Apontamento_pkey" PRIMARY KEY ("id_apontamento")
);

-- CreateIndex
CREATE UNIQUE INDEX "Empresas_cnpj_key" ON "Empresas"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_identificador_key" ON "Usuarios"("identificador");

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_cpf_key" ON "Usuarios"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Maquinas_serie_key" ON "Maquinas"("serie");

-- AddForeignKey
ALTER TABLE "Usuarios" ADD CONSTRAINT "Usuarios_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "Empresas"("id_empresa") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Setores" ADD CONSTRAINT "Setores_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "Empresas"("id_empresa") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categoria_Maquina" ADD CONSTRAINT "Categoria_Maquina_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "Empresas"("id_empresa") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Maquinas" ADD CONSTRAINT "Maquinas_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "Empresas"("id_empresa") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Maquinas" ADD CONSTRAINT "Maquinas_id_setor_fkey" FOREIGN KEY ("id_setor") REFERENCES "Setores"("id_setor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Maquinas" ADD CONSTRAINT "Maquinas_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "Categoria_Maquina"("id_categoria") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Setor_Gestor" ADD CONSTRAINT "Setor_Gestor_id_setor_fkey" FOREIGN KEY ("id_setor") REFERENCES "Setores"("id_setor") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Setor_Gestor" ADD CONSTRAINT "Setor_Gestor_id_gestor_fkey" FOREIGN KEY ("id_gestor") REFERENCES "Usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Setor_Gestor" ADD CONSTRAINT "Setor_Gestor_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "Empresas"("id_empresa") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turno" ADD CONSTRAINT "Turno_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "Empresas"("id_empresa") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EscalaTrabalho" ADD CONSTRAINT "EscalaTrabalho_id_operador_fkey" FOREIGN KEY ("id_operador") REFERENCES "Usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EscalaTrabalho" ADD CONSTRAINT "EscalaTrabalho_id_turno_fkey" FOREIGN KEY ("id_turno") REFERENCES "Turno"("id_turno") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Motivos_Parada" ADD CONSTRAINT "Motivos_Parada_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "Empresas"("id_empresa") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdemProducao" ADD CONSTRAINT "OrdemProducao_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "Empresas"("id_empresa") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdemProducao" ADD CONSTRAINT "OrdemProducao_id_maquina_fkey" FOREIGN KEY ("id_maquina") REFERENCES "Maquinas"("id_maquina") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Historico_Eventos" ADD CONSTRAINT "Historico_Eventos_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "Empresas"("id_empresa") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Historico_Eventos" ADD CONSTRAINT "Historico_Eventos_id_maquina_fkey" FOREIGN KEY ("id_maquina") REFERENCES "Maquinas"("id_maquina") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Historico_Eventos" ADD CONSTRAINT "Historico_Eventos_id_ordemProducao_fkey" FOREIGN KEY ("id_ordemProducao") REFERENCES "OrdemProducao"("id_ordem") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Historico_Eventos" ADD CONSTRAINT "Historico_Eventos_id_turno_fkey" FOREIGN KEY ("id_turno") REFERENCES "Turno"("id_turno") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Historico_Eventos" ADD CONSTRAINT "Historico_Eventos_id_motivo_parada_fkey" FOREIGN KEY ("id_motivo_parada") REFERENCES "Motivos_Parada"("id_motivo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Apontamento" ADD CONSTRAINT "Apontamento_id_empresa_fkey" FOREIGN KEY ("id_empresa") REFERENCES "Empresas"("id_empresa") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Apontamento" ADD CONSTRAINT "Apontamento_id_ordemProducao_fkey" FOREIGN KEY ("id_ordemProducao") REFERENCES "OrdemProducao"("id_ordem") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Apontamento" ADD CONSTRAINT "Apontamento_id_maquina_fkey" FOREIGN KEY ("id_maquina") REFERENCES "Maquinas"("id_maquina") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Apontamento" ADD CONSTRAINT "Apontamento_id_operador_fkey" FOREIGN KEY ("id_operador") REFERENCES "Usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Apontamento" ADD CONSTRAINT "Apontamento_id_turno_fkey" FOREIGN KEY ("id_turno") REFERENCES "Turno"("id_turno") ON DELETE RESTRICT ON UPDATE CASCADE;

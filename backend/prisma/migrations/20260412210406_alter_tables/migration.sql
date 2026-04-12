/*
  Warnings:

  - The primary key for the `EscalaTrabalho` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `dia_semana` on the `EscalaTrabalho` table. All the data in the column will be lost.
  - Added the required column `dia_semana` to the `Turno` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EscalaTrabalho" DROP CONSTRAINT "EscalaTrabalho_pkey",
DROP COLUMN "dia_semana",
ADD CONSTRAINT "EscalaTrabalho_pkey" PRIMARY KEY ("id_operador", "id_turno");

-- AlterTable
ALTER TABLE "Maquinas" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Turno" ADD COLUMN     "dia_semana" "DiaSemana" NOT NULL;

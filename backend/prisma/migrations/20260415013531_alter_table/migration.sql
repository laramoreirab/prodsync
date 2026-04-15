-- DropForeignKey
ALTER TABLE "Maquinas" DROP CONSTRAINT "Maquinas_id_setor_fkey";

-- AlterTable
ALTER TABLE "Maquinas" ALTER COLUMN "id_setor" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Setores" ADD COLUMN     "localizacao" VARCHAR(255);

-- AddForeignKey
ALTER TABLE "Maquinas" ADD CONSTRAINT "Maquinas_id_setor_fkey" FOREIGN KEY ("id_setor") REFERENCES "Setores"("id_setor") ON DELETE SET NULL ON UPDATE CASCADE;

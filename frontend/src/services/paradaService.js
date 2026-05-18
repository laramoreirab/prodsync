import { apiFetch } from "@/lib/api";
import { MotivosFrequentesArraySchema } from "@/features/paradas/schemas/paradasSchema";
import { MediaParadasDiaArraychema } from '@/features/paradas/schemas/paradasSchema'

export const paradaService = {
  async getParadas() {
    const data = await apiFetch("/api/dashboard/top-motivos-parada");
    return MotivosFrequentesArraySchema.parse(data.dados);
  },
};

export const paradasPorDiaService = {
  async getParadasDia() {
    const data = await apiFetch("/api/dashboard/media-paradas-por-dia");
    return MediaParadasDiaArraychema.parse(data.dados);
  },
};


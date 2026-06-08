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
  async getParadasDia(setorId = null) {
    const query = setorId ? `?setorId=${encodeURIComponent(setorId)}` : "";
    const data = await apiFetch(`/api/dashboard/media-paradas-por-dia${query}`);
    return MediaParadasDiaArraychema.parse(data.dados);
  },
};


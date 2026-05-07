import { apiFetch } from "./api";
import { MotivosFrequentesArraySchema } from "@/features/paradas/schemas/paradasSchema";
import { mockMotivosFrequentesParadas } from "./mockData";

import {MediaParadasDiaArraychema} from "@/features/paradas/schemas/paradasSchema";
import { mockMediaParadasDia } from "./mockData";

const USE_MOCK = false; 

export const paradaService = {
  async getParadas() {
    if (USE_MOCK) return MotivosFrequentesArraySchema.parse(mockMotivosFrequentesParadas);
    const data = await apiFetch("/api/maquinas/status");
    return MaquinaStatusArraySchema.parse(data.dados);
  },
};

export const paradasPorDiaService = {
  async getParadasDia() {
    if (USE_MOCK) return MediaParadasDiaArraychema.parse(mockMediaParadasDia);
    const data = await apiFetch("/api/dashboard/media-paradas-por-dia");
    return MediaParadasDiaArraychema.parse(data.dados);
  }
}

// import { apiFetch } from "./api";
// import {
//MaquinaStatusSchema
// } from "@features/maquinas/schemas/maquinaSchema";

// export const maquinaService = {
//   async getStatus() {
//     const data = await apiFetch("/maquinas/status");
//     return MaquinaStatusSchema.parse(data); 
//   },




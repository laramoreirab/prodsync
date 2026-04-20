import { apiFetch } from "./api";
import { MotivosFrequentesArraySchema } from "@/features/paradas/schemas/paradasSchema";
import { mockMotivosFrequentesParadas } from "./mockData";

import {MediaParadasDiaArraychema} from "@/features/paradas/schemas/paradasSchema";
import { mockMediaParadasDia } from "./mockData";

const USE_MOCK = true; 

export const paradaService = {
  async getParadas() {
    if (USE_MOCK) return MotivosFrequentesArraySchema.parse(mockMotivosFrequentesParadas);
    const data = await apiFetch("/maquinas/status");
    return MaquinaStatusArraySchema.parse(data);
  },
};

export const paradasPorDiaService = {
  async getParadasDia() {
    if (USE_MOCK) return MediaParadasDiaArraychema.parse(mockMediaParadasDia);
    const data = await apiFetch("/maquinas/parada_dia");
    return MediaParadasDiaArraychema.parse(data);
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




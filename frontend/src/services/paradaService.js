import { apiFetch } from "./api";
import { MotivosFrequentesArraySchema } from "@/features/paradas/schemas/paradasSchema";
import { mockMotivosFrequentesParadas } from "./mockData";

const USE_MOCK = true; 

export const paradaService = {
  async getParadas() {
    if (USE_MOCK) return MotivosFrequentesArraySchema.parse(mockMotivosFrequentesParadas);
    const data = await apiFetch("/maquinas/status");
    return MaquinaStatusArraySchema.parse(data);
  },
};

// import { apiFetch } from "./api";
// import {
//MaquinaStatusSchema
// } from "@features/maquinas/schemas/maquinaSchema";

// export const maquinaService = {
//   async getStatus() {
//     const data = await apiFetch("/maquinas/status");
//     return MaquinaStatusSchema.parse(data); 
//   },




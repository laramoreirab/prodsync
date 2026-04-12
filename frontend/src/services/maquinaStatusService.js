// import { apiFetch } from "./api";
// import {
//MaquinaStatusSchema
// } from "@features/maquinas/schemas/maquinaSchema";

// export const maquinaService = {
//   async getStatus() {
//     const data = await apiFetch("/maquinas/status");
//     return MaquinaStatusSchema.parse(data); 
//   },

import { apiFetch } from "./api";
import { MaquinaStatusArraySchema } from "@features/maquinas/schemas/maquinaStatusSchema";
import { mockMaquinaStatus } from "./mockData";

const USE_MOCK = true;

export const maquinaStatusService = {
  async getStatus() {
    if (USE_MOCK) return MaquinaStatusArraySchema.parse(mockMaquinaStatus);
    const data = await apiFetch("/maquinas/status");
    return MaquinaStatusArraySchema.parse(data);
  },
};
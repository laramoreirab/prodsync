// src/features/ordens/schemas/ordenSchema.js
import { z } from "zod";

// KPIs simples
export const OPKPISchema = z.object({
  titulo: z.string(),
  valor:  z.coerce.string(),
});

// Eficiência Geral (gauge)
export const OPEficienciaSchema = z.object({
  eficiencia: z.number().min(0).max(100),
});

// Top 3 OPs com maior refugo (bar horizontal)
export const OPRefugoSchema = z.object({
  op:     z.string(),   // "#4491 (Elc)"
  refugo: z.number(),
});

// Carga de trabalho por setor (bar vertical)
export const OPCargaSetorSchema = z.object({
  setor: z.string(),
  carga: z.number(),
});

// Status das OPs (pie chart)
export const OPStatusSchema = z.object({
  name:  z.string(),
  value: z.number(),
});

// OPs Concluídas por dia (line chart)
export const OPConcluidasDiaSchema = z.object({
  dia:   z.string(),
  total: z.number(),
});

// Arrays
export const OPRefugoArraySchema        = z.array(OPRefugoSchema);
export const OPCargaSetorArraySchema    = z.array(OPCargaSetorSchema);
export const OPStatusArraySchema        = z.array(OPStatusSchema);
export const OPConcluidasDiaArraySchema = z.array(OPConcluidasDiaSchema);
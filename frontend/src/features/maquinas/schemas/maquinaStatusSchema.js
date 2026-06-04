// src/features/maquinas/schemas/maquinaStatusSchema.js
import { z } from "zod";

// ─── Schemas existentes ────────────────────────────────────────────────────
export const MaquinaStatusSchema = z.object({
  name:  z.string(),
  setorId: z.number().optional(),
});
export const MaquinaAtivaPorTurnoSchema = z.object({
  titulo: z.string(),
  valor:  z.string(),
});
export const MaquinaStatusArraySchema = z.array(MaquinaStatusSchema);

// ─── Novos schemas ─────────────────────────────────────────────────────────

// Quantidade de máquinas por setor (BarHorizontal)
export const QtdMaquinaPorSetorSchema = z.object({
  id:    z.number(),
  setor: z.string(),
  quantidade:   z.number(),
});
export const QtdMaquinaPorSetorArraySchema = z.array(QtdMaquinaPorSetorSchema);

// Tempo médio de parada por setor (BarVertical — eixo Y = minutos)
export const TempoMedioParadaSchema = z.object({
  maquina:   z.string(),
  minutos: z.number(),
});
export const TempoMedioParadaArraySchema = z.array(TempoMedioParadaSchema);

// Produção vs Defeito por setor (BarStackedHorizontal)
// "defeito" = nome exato que o componente BarStackedHorizontal espera
export const ProducaoDefeitoPorSetorSchema = z.object({
  maquina:      z.string(),
  produzidas: z.number(),
  defeito:    z.number(),
  setorId: z.number().nullable().optional(),
});
export const ProducaoDefeitoPorSetorArraySchema = z.array(ProducaoDefeitoPorSetorSchema);

// Status por turno (BarStackedVertical — ativas/paradas/manutencao)
export const MaquinaPorTurnoSchema = z.object({
  turno:      z.string(),
  ativas:     z.number(),
  paradas:    z.number(),
  manutencao: z.number(),
  setorId: z.number().optional(),
  setup: z.number(),
});

export const ProducaoTotalSchema = z.object({
  data:  z.string(),
  data: z.string(),
  total: z.number(),
  setorId: z.number().optional(),
});

export const ProducaoTotalArraySchema = z.array(ProducaoTotalSchema);
export const MaquinaPorTurnoArraySchema = z.array(MaquinaPorTurnoSchema);

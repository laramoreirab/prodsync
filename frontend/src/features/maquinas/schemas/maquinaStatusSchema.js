// src/features/maquinas/schemas/maquinaStatusSchema.js
import { z } from "zod";

// ─── Schemas existentes ────────────────────────────────────────────────────
export const MaquinaStatusSchema = z.object({
  name:  z.string(),
  value: z.number(),
});
export const MaquinaAtivaPorTurnoSchema = z.object({
  titulo: z.string(),
  valor:  z.string(),
});
export const MaquinaStatusArraySchema = z.array(MaquinaStatusSchema);

// ─── Novos schemas ─────────────────────────────────────────────────────────

// Quantidade de máquinas por setor (BarHorizontal)
export const QtdMaquinaPorSetorSchema = z.object({
  setor: z.string(),
  qtd:   z.number(),
});
export const QtdMaquinaPorSetorArraySchema = z.array(QtdMaquinaPorSetorSchema);

// Tempo médio de parada por setor (BarVertical — eixo Y = minutos)
export const TempoMedioParadaSchema = z.object({
  setor:   z.string(),
  minutos: z.number(),
});
export const TempoMedioParadaArraySchema = z.array(TempoMedioParadaSchema);

// Produção vs Defeito por setor (BarStackedHorizontal)
// "defeito" = nome exato que o componente BarStackedHorizontal espera
export const ProducaoDefeitoPorSetorSchema = z.object({
  setor:      z.string(),
  produzidas: z.number(),
  defeito:    z.number(),
});
export const ProducaoDefeitoPorSetorArraySchema = z.array(ProducaoDefeitoPorSetorSchema);

// Status por turno (BarStackedVertical — ativas/paradas/manutencao)
export const MaquinaPorTurnoSchema = z.object({
  turno:      z.string(),
  ativas:     z.number(),
  paradas:    z.number(),
  manutencao: z.number(),
});
export const MaquinaPorTurnoArraySchema = z.array(MaquinaPorTurnoSchema);
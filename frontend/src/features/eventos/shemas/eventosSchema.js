// src/features/eventos/schemas/eventosSchema.js
import { z } from "zod";

// --- Paradas Justificadas x Não Justificadas ---
export const ParadasComparadasSchema = z.object({
  name:  z.string(),
  value: z.number(),
});

// --- Top Motivos de Parada por Tempo ---
export const MotivoTempoSchema = z.object({
  motivo:  z.string(),   // ex: "Limpeza"
  tempo:   z.string(),   // ex: "2h 30m" — label exibido na barra
  minutos: z.number(),   // ex: 150     — valor numérico para o tamanho da barra
});

export const MotivoTempoArraySchema = z.array(MotivoTempoSchema);
export const ParadasComparadasArraySchema = z.array(ParadasComparadasSchema);
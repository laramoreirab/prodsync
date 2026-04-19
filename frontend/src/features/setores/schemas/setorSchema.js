import { z } from "zod";

export const SetorSchema = z.object({
  id:             z.number(),
  setor:          z.string(),
  gestor:         z.string(),
  oeeMedio:       z.number().min(0).max(100),
  qtdMaquinas:    z.number(),
  qtdOperadores:  z.number(),
});

export const SetorArraySchema = z.array(SetorSchema);

export const SetorKPISchema = z.object({
  titulo:    z.string(),
  subtitulo: z.string(),
  valor:     z.coerce.string(),
});

export const OEEPorSetorSchema = z.object({
  setor: z.string(),
  oee:   z.number().min(0).max(100),
});

export const OEEPorSetorArraySchema = z.array(OEEPorSetorSchema);

export const RefugoPorSetorSchema = z.object({
  setor:  z.string(),
  refugo: z.number(),
});

export const RefugoPorSetorArraySchema = z.array(RefugoPorSetorSchema);

export const OEECriticoSchema = z.object({
  setor: z.string(),
  oee:   z.number().min(0).max(100),
});
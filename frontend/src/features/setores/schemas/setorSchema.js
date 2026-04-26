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

export const SetorMaquinaStatusSchema = z.object({
  emProducao: z.number(),
  emSetup:    z.number(),
  emParada:   z.number(),
});
 
export const SetorOEEMedioSchema = z.object({
  setor: z.string(),
  oee:   z.number().min(0).max(100),
});
 
export const SetorOEEEvolucaoSchema = z.object({
  dia: z.string(),
  oee: z.number().min(0).max(100),
});
export const SetorOEEEvolucaoArraySchema = z.array(SetorOEEEvolucaoSchema);
 
export const SetorTopOperadoresSchema = z.object({
  operador: z.string(),
  qtd:      z.number(),
});
export const SetorTopOperadoresArraySchema = z.array(SetorTopOperadoresSchema);
 
export const SetorMotivosParadaSchema = z.object({
  motivo: z.string(),
  qtd:    z.number(),
});

export const SetorProducaoSemanalSchema = z.object({
  dia: z.string(),
  qtd: z.number(),
});

export const SetorMotivosParadaArraySchema = z.array(SetorMotivosParadaSchema);
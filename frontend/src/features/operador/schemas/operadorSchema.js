import { z } from "zod";

// OEE das máquinas que o operador controla
export const OEEOperadorSchema = z.object({
  disponibilidade: z.number().min(0).max(100),
  performance:     z.number().min(0).max(100),
  qualidade:       z.number().min(0).max(100),
  oee:             z.number().min(0).max(100),
});

// Peças produzidas por dia da semana
export const PecasPorDiaSchema = z.object({
  dia: z.string(),   //Seg, Ter
});
export const PecasPorDiaArraySchema = z.array(PecasPorDiaSchema);

// Produção por hora 
export const ProducaoPorHoraOperadorSchema = z.object({
  hora: z.string(),  //0, 3
  qtd:  z.number(),
});
export const ProducaoPorHoraOperadorArraySchema = z.array(ProducaoPorHoraOperadorSchema);

// Meta de produção 
export const MetaProducaoSchema = z.object({
  completo:   z.number().min(0).max(100), // percentual concluído
  restante:   z.number().min(0).max(100), // percentual restante
});

// Paradas registradas vs reais por dia
export const ParadasComparadasOperadorSchema = z.object({
  dia:        z.string(),   // "Seg", "Ter"
  registradas: z.number(),
  reais:       z.number(),
});
export const ParadasComparadasOperadorArraySchema = z.array(ParadasComparadasOperadorSchema);

// Eficiência por máquina 
export const EficienciaMaquinaSchema = z.object({
  maquina:    z.string(),   //THA-1
  eficiencia: z.number().min(0).max(100),
});
export const EficienciaMaquinaArraySchema = z.array(EficienciaMaquinaSchema);
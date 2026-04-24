import { z } from "zod";

// Principais Motivos de Refugo (PieChart)
export const MotivoRefugoSchema = z.object({
  name:  z.string(),   // "Peça Incompleta", "Rolhas na Injeção", "Rebarba Grossa"
  value: z.number(),
});
export const MotivoRefugoArraySchema = z.array(MotivoRefugoSchema);

// Top 3 Motivos Frequentes de Setup (BarHorizontal)
export const MotivoSetupSchema = z.object({
  motivo:  z.string(),
  minutos: z.number(),
});
export const MotivoSetupArraySchema = z.array(MotivoSetupSchema);

// Resumo OEE da Máquina (GaugeSemicircular — mesmo formato do OEESchema)
export const OEEMaquinaSchema = z.object({
  disponibilidade: z.number().min(0).max(100),
  performance:     z.number().min(0).max(100),
  qualidade:       z.number().min(0).max(100),
  oee:             z.number().min(0).max(100),
});

// Evolução do OEE há 7 dias (AreaChart/LineChart)
export const OEEEvolucaoSchema = z.object({
  dia: z.string(),   // "Dia 1", "Dia 2" ...
  oee: z.number().min(0).max(100),
});
export const OEEEvolucaoArraySchema = z.array(OEEEvolucaoSchema);

// Velocidade Atual x Velocidade Padrão (BarVertical com 2 barras)
export const VelocidadeSchema = z.object({
  tipo:  z.string(),   // "Velocidade Normal", "Velocidade Atual"
  valor: z.number(),
});
export const VelocidadeArraySchema = z.array(VelocidadeSchema);
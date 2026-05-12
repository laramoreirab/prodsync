import { z } from "zod";

// Quantidade total por perfil 
export const QtdUsuariosPorPerfilSchema = z.object({
  name:  z.string(),  // gestores e operadores
  value: z.number(),
});

// Quantidade por setor
export const QtdUsuariosPorSetorSchema = z.object({
  setor: z.string(),
  qtd:   z.number(),
});

// Top 5 Operadores com mais peças
export const TopOperadoresSchema = z.object({
  operador: z.string(),
  media: z.number(),
  setorId: z.number().optional(),
});

// Tempo médio de sessão por perfil 
export const TempoSessaoPerfilSchema = z.object({
  perfil: z.string(),  //Gestores e Operadores
  horas:  z.number(),  //valor numérico para a barra
  label:  z.string(),  //01:25 h — texto exibido
  setorId: z.number().optional(),
});

// Rotatividade de usuários 
export const RoatividadeSchema = z.object({
  mes:         z.string(),
  novos:       z.number(),
  desligados:  z.number(),
  setorId:     z.number().optional(),
});

export const UsuariosPorTurnoSchema = z.object({
  turno: z.string(),
  value: z.number(),
  setorId: z.number().optional(),
});

export const UsuarioTaxaRefugoSchema = z.object({
  operador: z.string(),
  taxa:     z.number(),
  setorId:  z.number().optional(),
});

export const ProducaoMediaUsuarioSchema = z.object({
  usuario: z.string(),
  media:   z.number(),
  setorId: z.number().optional(),
});

// Sobrecarga de máquina por usuário por setor 
export const CumprimentoMetaSetorSchema = z.object({
  setor: z.string(),
  media: z.number(),
});

// Produção média por dia por setor
export const ProducaoMediaSetorSchema = z.object({
  setor: z.string(),
  media: z.number(),
});
export const ProducaoMediaUsuarioArraySchema = z.array(ProducaoMediaUsuarioSchema);
export const UsuariosPorTurnoArraySchema = z.array(UsuariosPorTurnoSchema);
export const UsuarioTaxaRefugoArraySchema = z.array(UsuarioTaxaRefugoSchema);
export const ProducaoMediaSetorArraySchema = z.array(ProducaoMediaSetorSchema);
export const CumprimentoMetaSetorArraySchema = z.array(CumprimentoMetaSetorSchema);
export const RotatividadeArraySchema = z.array(RoatividadeSchema);
export const TempoSessaoPerfilArraySchema = z.array(TempoSessaoPerfilSchema);
export const TopOperadoresArraySchema = z.array(TopOperadoresSchema);
export const QtdUsuariosPorSetorArraySchema = z.array(QtdUsuariosPorSetorSchema);
export const QtdUsuariosPorPerfilArraySchema = z.array(QtdUsuariosPorPerfilSchema);






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
  setor: z.string(),   
  media: z.number(),   
});

// Tempo médio de sessão por perfil 
export const TempoSessaoPerfilSchema = z.object({
  perfil: z.string(),  //Gestores e Operadores
  horas:  z.number(),  //valor numérico para a barra
  label:  z.string(),  //01:25 h — texto exibido
});

// Rotatividade de usuários 
export const RoatividadeSchema = z.object({
  mes:         z.string(),
  novos:       z.number(),
  desligados:  z.number(),
});

// Sobrecarga de máquina por usuário por setor 
export const SobrecargaSetorSchema = z.object({
  setor: z.string(),
  media: z.number(),
});

// Produção média por dia por setor
export const ProducaoMediaSetorSchema = z.object({
  setor: z.string(),
  media: z.number(),
});
export const ProducaoMediaSetorArraySchema = z.array(ProducaoMediaSetorSchema);
export const SobrecargaSetorArraySchema = z.array(SobrecargaSetorSchema);
export const RotatividadeArraySchema = z.array(RoatividadeSchema);
export const TempoSessaoPerfilArraySchema = z.array(TempoSessaoPerfilSchema);
export const TopOperadoresArraySchema = z.array(TopOperadoresSchema);
export const QtdUsuariosPorSetorArraySchema = z.array(QtdUsuariosPorSetorSchema);
export const QtdUsuariosPorPerfilArraySchema = z.array(QtdUsuariosPorPerfilSchema);






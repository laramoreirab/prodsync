import { z } from "zod";

export const CadastroSchema = z.object({
  nomeEmpresa:    z.string().min(2, "Nome muito curto"),
  cnpj:           z.string().regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, "CNPJ inválido"),
  telefone:       z.string().min(10, "Telefone inválido"),
  endereco:       z.string().min(5, "Endereço muito curto"),
  email:          z.string().email("Email inválido"),
  representante:  z.string().min(2, "Nome muito curto"),
  cpf:            z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido"),
  senha:          z.string().min(8, "Mínimo 8 caracteres"),
});
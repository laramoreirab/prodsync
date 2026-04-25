import { apiFetch } from "./api";
import { CadastroSchema } from "@features/cadastro/schemas/cadastroSchema";

export const cadastroService = {
  async cadastrar(formData) {
    const dados = CadastroSchema.parse(formData); // valida antes de enviar
    return apiFetch(`/api/auth/cadastrar`, {
      method: "POST",
      body: JSON.stringify(dados),
    });
  },
};
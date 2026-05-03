import { apiFetch } from "@/lib/api.js"
import { CadastroSchema } from "@features/cadastro/schemas/cadastroSchema";

export const cadastroService = {
  async cadastrar(formData) {
    // O Zod valida os dados vindos
    const dadosValidados = CadastroSchema.parse(formData);
    //tirar as máscaras para enviar os dados
    const dadosLimpos = {
      ...dadosValidados,
      cnpj: formData.cnpj.replace(/\D/g, ""),      // Remove pontos, barras e traços
      cpf: formData.cpf.replace(/\D/g, ""),        // Remove pontos e traços
      telefone: formData.telefone.replace(/\D/g, "") // Remove parênteses, espaços e traços
    };

    console.log(dadosLimpos)

    return apiFetch('/api/auth/cadastrar', {
      method: "POST",
      body: JSON.stringify(dadosLimpos),
    });
  },
};
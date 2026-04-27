"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import SuccessCard from "@/components/ui/modalCadastro";
import { cadastroService } from "@/services/cadastroService";
import { ZodError } from "zod";
import { useRouter } from "next/navigation";

import { mascaraCNPJ, mascaraCPF, mascaraTelefone } from "@/utils/mascaras";

const CAMPOS_INICIAIS = {
  nome_empresa: "", cnpj: "", telefone: "", endereco: "",
  email: "", nome_representante: "", cpf: "", senha: "",
};

export default function RegisterForm() {
  const router = useRouter()

  const [form, setForm] = useState(CAMPOS_INICIAIS);
  const [erros, setErros] = useState({});
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  function handleChange(campo, valor) {
    setForm(prev => ({ ...prev, [campo]: valor }));
    setErros(prev => ({ ...prev, [campo]: null }));
  }

  async function handleSubmit() {
    setLoading(true);
    setErros({});

    try {
      const data = await cadastroService.cadastrar(form);
    if (data?.token) {
      localStorage.setItem("token", data.token);
    }
    setOpen(true);
    } catch (err) {
      if (err instanceof ZodError) {
        const mapa = {};
        err.errors.forEach(e => { mapa[e.path[0]] = e.message; });
        setErros(mapa);
      } else {
        console.error("Erro técnico:", err);
        setErros({ geral: "Erro ao criar conta. Tente novamente." });
      }
    } finally {
      setLoading(false);
    }
  }
  
  async function handleIrLogin() {
    setOpen(false)
    router.push('/')
  }
  async function handleContinuar() {
    setOpen(false)
    router.push('/adm')
  }

  return (
    <>
      <div className="w-full max-w-[600px] space-y-5 ml-0 md:ml-4 pt-16">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Bem-vindo ao ProdSync!</h1>
          <p className="text-md text-muted-foreground">
            Crie sua conta para acompanhar a produção em tempo real.
          </p>
        </div>

        <div className="space-y-4">
          <FormField label="Nome da Empresa" campo="nome_empresa" placeholder="Ex: Tech Ltda" value={form.nome_empresa} erro={erros.nome_empresa} onChange={handleChange} />
          <FormField label="CNPJ da Empresa" campo="cnpj" placeholder="00.000.000/0000-00" value={form.cnpj} erro={erros.cnpj} onChange={handleChange} mascara={mascaraCNPJ} />
          <FormField label="Telefone" campo="telefone" placeholder="(11) 99999-9999" value={form.telefone} erro={erros.telefone} onChange={handleChange} mascara={mascaraTelefone} />
          <FormField label="Endereço" campo="endereco" placeholder="Rua exemplo, 123" value={form.endereco} erro={erros.endereco} onChange={handleChange} />
          <FormField label="Email" campo="email" placeholder="empresa@email.com" value={form.email} erro={erros.email} onChange={handleChange} />
          <FormField label="Representante" campo="nome_representante" placeholder="Seu nome" value={form.nome_representante} erro={erros.nome_representante} onChange={handleChange} />
          <FormField label="CPF" campo="cpf" placeholder="000.000.000-00" value={form.cpf} erro={erros.cpf} onChange={handleChange} mascara={mascaraCPF} />
          <FormField label="Senha" campo="senha" placeholder="••••••••" type="password" value={form.senha} erro={erros.senha} onChange={handleChange} />
        </div>

        {erros.geral && (
          <p className="text-sm text-destructive text-center">{erros.geral}</p>
        )}

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full h-11 bg-[#212e4b] hover:bg-slate-800 text-white text-sm font-medium rounded-lg"
        >
          {loading ? "Criando conta..." : "Criar conta"}
        </Button>

        <p className="text-sm text-center text-muted-foreground">
          Já tem uma conta?{" "}
          <span className="font-medium text-foreground cursor-pointer hover:underline">
            Entrar
          </span>
        </p>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <SuccessCard onClose={handleIrLogin} onContinue={handleContinuar} />
        </div>
      )}
    </>
  );
}

// ← mascara é opcional: se não passar, comportamento normal
function FormField({ label, campo, placeholder, type = "text", value, erro, onChange, mascara }) {
  function handleChange(e) {
    const valor = mascara ? mascara(e.target.value) : e.target.value;
    onChange(campo, valor);
  }

  return (
    <div className="space-y-1">
      <Label className="text-xs font-medium text-slate-900">{label}</Label>
      <Input
        type={type}
        className="h-9"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        aria-invalid={!!erro}
      />
      {erro && <p className="text-xs text-destructive">{erro}</p>}
    </div>
  );
}
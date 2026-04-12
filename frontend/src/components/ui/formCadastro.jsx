"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import SuccessCard from "@/components/ui/modalCadastro";
import { cadastroService } from "@/services/cadastroService";
import { ZodError } from "zod";

import { mascaraCNPJ, mascaraCPF, mascaraTelefone } from "@/utils/mascaras";

const CAMPOS_INICIAIS = {
  nomeEmpresa: "", cnpj: "", telefone: "", endereco: "",
  email: "", representante: "", cpf: "", senha: "",
};

export default function RegisterForm() {
  const [form,    setForm]    = useState(CAMPOS_INICIAIS);
  const [erros,   setErros]   = useState({});
  const [loading, setLoading] = useState(false);
  const [open,    setOpen]    = useState(false);

  function handleChange(campo, valor) {
    setForm(prev => ({ ...prev, [campo]: valor }));
    setErros(prev => ({ ...prev, [campo]: null }));
  }

  async function handleSubmit() {
    setLoading(true);
    setErros({});

    try {
      await cadastroService.cadastrar(form);
      setOpen(true);
    } catch (err) {
      if (err instanceof ZodError) {
        const mapa = {};
        err.errors.forEach(e => { mapa[e.path[0]] = e.message; });
        setErros(mapa);
      } else {
        setErros({ geral: "Erro ao criar conta. Tente novamente." });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="w-full max-w-sm space-y-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Bem-vindo ao ProdSync</h1>
          <p className="text-sm text-muted-foreground">
            Crie sua conta para acompanhar a produção em tempo real.
          </p>
        </div>

        <div className="space-y-3">
          <FormField label="Nome da Empresa" campo="nomeEmpresa"   placeholder="Ex: Tech Ltda"         value={form.nomeEmpresa}   erro={erros.nomeEmpresa}   onChange={handleChange} />
          <FormField label="CNPJ da Empresa" campo="cnpj"          placeholder="00.000.000/0000-00"     value={form.cnpj}          erro={erros.cnpj}          onChange={handleChange} mascara={mascaraCNPJ} />
          <FormField label="Telefone"        campo="telefone"      placeholder="(11) 99999-9999"        value={form.telefone}      erro={erros.telefone}      onChange={handleChange} mascara={mascaraTelefone} />
          <FormField label="Endereço"        campo="endereco"      placeholder="Rua exemplo, 123"       value={form.endereco}      erro={erros.endereco}      onChange={handleChange} />
          <FormField label="Email"           campo="email"         placeholder="empresa@email.com"      value={form.email}         erro={erros.email}         onChange={handleChange} />
          <FormField label="Representante"   campo="representante" placeholder="Seu nome"               value={form.representante} erro={erros.representante} onChange={handleChange} />
          <FormField label="CPF"             campo="cpf"           placeholder="000.000.000-00"          value={form.cpf}           erro={erros.cpf}           onChange={handleChange} mascara={mascaraCPF} />
          <FormField label="Senha"           campo="senha"         placeholder="••••••••" type="password" value={form.senha}       erro={erros.senha}         onChange={handleChange} />
        </div>

        {erros.geral && (
          <p className="text-sm text-destructive text-center">{erros.geral}</p>
        )}

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full h-9 bg-[#212e4b] hover:bg-slate-800 text-white text-sm font-medium rounded-lg"
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
          <SuccessCard onClose={() => setOpen(false)} onContinue={() => setOpen(false)} />
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
"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import SuccessCard from "@/components/ui/modalCadastro";

export default function RegisterForm() {
  const [open, setOpen] = useState(false); 

  return (
    <>
      <div className="w-full max-w-sm space-y-4">
        
        {/* TITULO */}
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Bem-vindo ao ProdSync
          </h1>
          <p className="text-sm text-muted-foreground">
            Crie sua conta para acompanhar a produção em tempo real.
          </p>
        </div>

        {/* FORM */}
        <div className="space-y-3">
          <FormField label="Nome da Empresa" placeholder="Ex: Tech Ltda" />
          <FormField label="CNPJ da Empresa" placeholder="00.000.000/0000-00" />
          <FormField label="Telefone" placeholder="(11) 99999-9999" />
          <FormField label="Endereço" placeholder="Rua exemplo, 123" />
          <FormField label="Email" placeholder="empresa@email.com" />
          <FormField label="Representante" placeholder="Seu nome" />
          <FormField label="CPF" placeholder="000.000.000-00" />

          <div className="space-y-1">
            <Label>Senha</Label>
            <Input type="password" placeholder="••••••••" />
          </div>
        </div>

        {/* BUTTON CRIAR CONTA */}
        <Button onClick={() => setOpen(true)} className="w-full h-9 bg-[#212e4b] hover:bg-[#1a253c] hover:bg-slate-800 text-white text-sm font-medium rounded-lg">
          Criar conta
        </Button>

        {/* AINDA NÃO TEM UMA CONTA */}
        <p className="text-sm text-center text-muted-foreground">
          Já tem uma conta?{" "}
          <span className="font-medium text-foreground cursor-pointer hover:underline">
            Entrar
          </span>
        </p>
      </div>

      {/* MODAL*/}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <SuccessCard
            onClose={() => setOpen(false)}
            onContinue={() => setOpen(false)}
          />
        </div>
      )}
    </>
  );
}

/* FORM */
function FormField({ label, placeholder }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs font-medium text-slate-900">
        {label}
      </Label>
      <Input className="h-9" placeholder={placeholder} />
    </div>
  );
}
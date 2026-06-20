"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import SuccessCard from "@/components/ui/modalCadastro";
import { cadastroService } from "@/services/cadastroService";
import { ZodError } from "zod";
import { useRouter } from "next/navigation";
import { setAuthToken } from "@/lib/auth";

import { Eye, EyeOff, CheckCircle2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";


import { mascaraCNPJ, mascaraCPF, mascaraTelefone } from "@/utils/mascaras";

const CAMPOS_INICIAIS = {
  nome_empresa: "",
  cnpj: "",
  telefone: "",
  endereco: "",
  email: "",
  nome_representante: "",
  cpf: "",
  senha: "",
};

export default function RegisterForm() {
  const router = useRouter();

  const [form, setForm] = useState(CAMPOS_INICIAIS);
  const [erros, setErros] = useState({});
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  function handleChange(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    setErros((prev) => ({ ...prev, [campo]: null }));
  }

  async function handleSubmit() {
    setLoading(true);
    setErros({});
    try {
      const data = await cadastroService.cadastrar(form);
      if (data.dados.token) {
        setAuthToken(data.dados.token, true);
        setOpen(true);
      } else {
        // Caso o backend retorne 200 mas sem token por algum motivo
        setErros({ geral: "Erro inesperado: token não recebido." });
      }
      setOpen(true);
    } catch (err) {
      if (err instanceof ZodError) {
        const mapa = {};
        err.errors.forEach((e) => {
          mapa[e.path[0]] = e.message;
        });
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
    setOpen(false);
    router.push("/");
  }
  async function handleContinuar() {
    setOpen(false);
    router.push("/adm");
  }

  return (
    <>
      <div className="w-full max-w-[600px] space-y-5 ml-0 md:ml-4 pt-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Bem-vindo ao ProdSync!
          </h1>
          <p className="text-md text-muted-foreground">
            Crie sua conta para acompanhar a produção em tempo real.
          </p>
        </div>

        <div className="space-y-4">
          <FormField
            label="Nome da Empresa"
            campo="nome_empresa"
            placeholder="Ex: Tech Ltda"
            value={form.nome_empresa}
            erro={erros.nome_empresa}
            onChange={handleChange}
          />
          <FormField
            label="CNPJ da Empresa"
            campo="cnpj"
            placeholder="00.000.000/0000-00"
            value={form.cnpj}
            erro={erros.cnpj}
            onChange={handleChange}
            mascara={mascaraCNPJ}
          />
          <FormField
            label="Telefone"
            campo="telefone"
            placeholder="(11) 99999-9999"
            value={form.telefone}
            erro={erros.telefone}
            onChange={handleChange}
            mascara={mascaraTelefone}
          />
          <FormField
            label="Endereço"
            campo="endereco"
            placeholder="Rua exemplo, 123"
            value={form.endereco}
            erro={erros.endereco}
            onChange={handleChange}
          />
          <FormField
            label="Email"
            campo="email"
            placeholder="empresa@email.com"
            value={form.email}
            erro={erros.email}
            onChange={handleChange}
          />
          <FormField
            label="Representante"
            campo="nome_representante"
            placeholder="Seu nome"
            value={form.nome_representante}
            erro={erros.nome_representante}
            onChange={handleChange}
          />
          <FormField
            label="CPF"
            campo="cpf"
            placeholder="000.000.000-00"
            value={form.cpf}
            erro={erros.cpf}
            onChange={handleChange}
            mascara={mascaraCPF}
          />
          <SenhaField
            value={form.senha}
            erro={erros.senha}
            onChange={handleChange}
          />
        </div>

        {erros.geral && (
          <p id="cadastro-error" role="alert" className="text-sm text-destructive text-center">{erros.geral}</p>
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
          <button type="button" onClick={handleIrLogin} className="font-medium text-foreground cursor-pointer hover:underline">Entrar</button>
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
function getAutoComplete(campo) {
  const mapa = {
    nome_empresa: "organization",
    cnpj: "off",
    telefone: "tel",
    endereco: "street-address",
    email: "email",
    nome_representante: "name",
    cpf: "off",
  };

  return mapa[campo] ?? "off";
}

function FormField({
  label,
  campo,
  placeholder,
  type = "text",
  value,
  erro,
  onChange,
  mascara,
}) {
  function handleChange(e) {
    const valor = mascara ? mascara(e.target.value) : e.target.value;
    onChange(campo, valor);
  }

  return (
    <div className="space-y-1">
      <Label htmlFor={campo} className="text-xs font-medium text-slate-900">{label}</Label>
      <Input
        id={campo}
        name={campo}
        type={type}
        className="h-9"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        autoComplete={getAutoComplete(campo)}
        aria-invalid={!!erro}
        aria-describedby={erro ? `${campo}-erro` : undefined}
        required
      />
      {erro && <p id={`${campo}-erro`} role="alert" className="text-xs text-destructive">{erro}</p>}
    </div>
  );
}

function SenhaField({ value, erro, onChange }) {
  const [showPassword, setShowPassword] = useState(false);

  const validacoes = [
    { texto: "Mínimo 8 caracteres", valido: value.length >= 8 },
    { texto: "Contém um número", valido: /\d/.test(value) },
    { texto: "Contém letra maiúscula", valido: /[A-Z]/.test(value) },
    { texto: "Contém caractere especial (!@#$%^&*)", valido: /[!@#$%^&*]/.test(value) },
  ];

  return (
    <div className="space-y-1">
      <Label htmlFor="senha" className="text-xs font-medium text-slate-900">Senha</Label>
      <div className="relative">
        <Input
          className="h-9 pr-10 [&::-ms-reveal]:hidden"
          id="senha"
          name="senha"
          placeholder="••••••••"
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange("senha", e.target.value)}
          aria-invalid={!!erro}
          aria-describedby={erro ? "senha-erro" : undefined}
          autoComplete="new-password"
          required
        />
        <Button
          className="absolute top-0 right-0 h-full px-3 hover:bg-transparent cursor-pointer"
          onClick={() => setShowPassword(!showPassword)}
          size="icon"
          type="button"
          variant="ghost"
          aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
        >
          {showPassword ? (
            <Eye aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
          ) : (
            <EyeOff aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </div>

      <AnimatePresence>
        {value.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <motion.div
              className="space-y-1 pt-1"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
              }}
            >
              {validacoes.map((v, i) => (
                <motion.div
                  key={i}
                  variants={{
                    hidden: { opacity: 0, x: -8 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.2, ease: "easeOut" } },
                  }}
                  className={`flex items-center gap-2 transition-colors duration-300 ${
                    v.valido ? "text-green-500" : "text-muted-foreground"
                  }`}
                >
                  {v.valido ? (
                    <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                  ) : (
                    <X aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                  )}
                  <span className="text-[13px]">{v.texto}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {erro && <p id="senha-erro" role="alert" className="text-xs text-destructive">{erro}</p>}
    </div>
  );
}
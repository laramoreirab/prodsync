"use client"

import { useEffect, useMemo, useState } from "react"
import { KeyRound, LockKeyhole, Palette, Save, Trash2, UserRound, Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { apiFetch } from "@/lib/api"
import { toast } from "sonner"
import { PageLayout } from "@/components/AnimatedComponents"

const adminTabs = [
  { id: "conta", label: "Conta", icon: UserRound },
  { id: "aparencia", label: "Aparência", icon: Palette },
  { id: "seguranca", label: "Segurança", icon: KeyRound },
]

const userTabs = [
  { id: "conta", label: "Conta", icon: UserRound },
  { id: "aparencia", label: "Aparência", icon: Palette },
  { id: "seguranca", label: "Segurança", icon: KeyRound },
]

const adminAccountFields = [
  { id: "id", label: "ID", readOnly: true },
  { id: "emailEmpresa", label: "Email da Empresa", type: "email" },
  { id: "telefoneEmpresa", label: "Telefone da Empresa" },
  { id: "enderecoEmpresa", label: "Endereço da Empresa" },
  { id: "cpfRepresentante", label: "CPF do Representante" },
]

const userAccountFields = [
  { id: "id", label: "ID", readOnly: true },
  { id: "nome", label: "Nome", readOnly: true },
  { id: "cpf", label: "CPF", readOnly: true },
  { id: "cargo", label: "Cargo", readOnly: true },
  { id: "email", label: "E-mail", type: "email", readOnly: true },
]

const passwordRules = [
  {
    label: "Pelo menos 1 caractere especial (como !#$%@)",
    test: (value) => /[!@#$%^&*(),.?":{}|<>_\-=\[\];'\\/]/.test(value),
  },
  {
    label: "Pelo menos 1 letra maiúscula (A-Z)",
    test: (value) => /[A-Z]/.test(value),
  },
  {
    label: "No mínimo 8 caracteres",
    test: (value) => value.length >= 8,
  },
]

function getInitialDarkMode() {
  if (typeof window === "undefined") return false
  const storedTheme = window.localStorage.getItem("prodsync-theme")
  if (storedTheme) return storedTheme === "dark"
  return document.documentElement.classList.contains("dark")
}

function SettingsSidebar({ activeTab, onTabChange, tabs }) {
  return (
    <aside className="w-full border-b border-zinc-100 p-6 dark:border-zinc-800 sm:w-64 sm:border-b-0 sm:border-r">
      <nav className="flex gap-2 overflow-x-auto sm:flex-col sm:overflow-visible space-y-2">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => onTabChange(id)}
              className={cn(
                "flex h-12 shrink-0 items-center gap-4 rounded-lg px-5 text-left text-base font-bold text-zinc-950 transition-all dark:text-zinc-100",
                "hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 dark:hover:bg-zinc-800",
                isActive && "bg-zinc-100 shadow-md dark:bg-zinc-800"
              )}
            >
              <Icon className="size-6 text-zinc-800 dark:text-zinc-200" />
              <span>{label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

function SectionTitle({ title, description }) {
  return (
    <div className="space-y-1.5 mb-8">
      <h2 className="text-2xl font-bold text-zinc-950 dark:text-zinc-100">{title}</h2>
      <p className="text-lg font-medium text-zinc-500 dark:text-zinc-400">{description}</p>
    </div>
  )
}

function SettingsInput(props) {
  return (
    <Input
      {...props}
      className={cn(
        "h-12 rounded-lg border-zinc-200 bg-white text-base dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 px-4",
        props.className
      )}
    />
  )
}

function AccountSettings({ role }) {
  const isAdmin = role === "admin"
  const [salvando, setSalvando] = useState(false)

  const [formData, setFormData] = useState({
    id: "",
    nome: "",
    cpf: "",
    cargo: "",
    email: "",
    emailEmpresa: "",
    telefoneEmpresa: "",
    enderecoEmpresa: "",
    cpfRepresentante: ""
  })

  useEffect(() => {
    async function buscarDados() {
      const dadosUsuario = await apiFetch("/api/auth/perfil")
      setFormData({
        id: dadosUsuario.dados.usuarios?.[0]?.id_usuario || dadosUsuario.dados.id_usuario || "",
        nome: dadosUsuario.dados.nome || "",
        cpf: aplicarMascaraCPF(dadosUsuario.dados.cpf) || "",
        cargo: dadosUsuario.dados.tipo || "",
        email: dadosUsuario.dados.email || "",
        emailEmpresa: dadosUsuario.dados.email || "",
        telefoneEmpresa: aplicarMascaraTelefone(dadosUsuario.dados.telefone) || "",
        enderecoEmpresa: dadosUsuario.dados.endereco || "",
        cpfRepresentante: aplicarMascaraCPF(dadosUsuario.dados.cpf_representante) || ""
      })
    }
    buscarDados()
  }, [])

  async function handleInputChange(e) {
    let { id, value } = e.target
    if (id === "telefoneEmpresa") {
      value = aplicarMascaraTelefone(value)
    } else if (id === "cpfRepresentante") {
      value = aplicarMascaraCPF(value)
    }
    setFormData((dadosAnteriores) => ({ ...dadosAnteriores, [id]: value }))
  }

  const fields = isAdmin ? adminAccountFields : userAccountFields

  function aplicarMascaraTelefone(valor) {
    let v = String(valor || "").replace(/\D/g, "")
    v = v.slice(0, 11)
    if (v.length <= 10) {
      return v.replace(
        /^(\d{2})(\d{0,4})(\d{0,4}).*/,
        (_, ddd, parte1, parte2) => `(${ddd}) ${parte1}${parte2 ? "-" + parte2 : ""}`
      )
    }
    return v.replace(
      /^(\d{2})(\d{0,5})(\d{0,4}).*/,
      (_, ddd, parte1, parte2) => `(${ddd}) ${parte1}${parte2 ? "-" + parte2 : ""}`
    )
  }

  function aplicarMascaraCPF(valor) {
    if (!valor) return ""
    let v = String(valor).replace(/\D/g, "")
    v = v.replace(/(\d{3})(\d)/, "$1.$2")
    v = v.replace(/(\d{3})(\d)/, "$1.$2")
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    return v.substring(0, 14)
  }

  async function handleSubmitPerfil(e) {
    e.preventDefault()
    setSalvando(true)
    try {
      const dadosParaEnviar = {
        email: formData.emailEmpresa,
        telefone: String(formData.telefoneEmpresa || "").replace(/\D/g, ""),
        endereco: formData.enderecoEmpresa,
        cpf_representante: String(formData.cpfRepresentante || "").replace(/\D/g, "")
      }
      const response = await apiFetch('/api/usuarios/atualizarEmpresa', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosParaEnviar)
      })
      if (response.sucesso) {
        toast.success("Informações da empresa atualizadas com sucesso!")
        if (response.dados) {
          setFormData((dadosAnteriores) => ({
            ...dadosAnteriores,
            emailEmpresa: response.dados.email || dadosAnteriores.emailEmpresa,
            telefoneEmpresa: aplicarMascaraTelefone(response.dados.telefone) || aplicarMascaraTelefone(dadosAnteriores.telefoneEmpresa),
            enderecoEmpresa: response.dados.endereco || dadosAnteriores.enderecoEmpresa,
            cpfRepresentante: aplicarMascaraCPF(response.dados.cpf_representante) || aplicarMascaraCPF(dadosAnteriores.cpfRepresentante),
          }))
        }
      } else {
        toast.error(response.mensagem || "Erro ao atualizar dados. Verifique os campos.")
      }
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error)
      toast.error("Erro interno ao tentar salvar as alterações.")
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="max-w-lg space-y-8">
      <SectionTitle
        title="Informações da Conta"
        description={isAdmin ? "Atualize suas informações pessoais" : "Visualização dos dados do seu perfil"}
      />
      <form className="space-y-6" onSubmit={handleSubmitPerfil}>
        {fields.map(({ id, label, type = "text", readOnly }) => {
          const isDisabled = !isAdmin || readOnly
          const valorDoInput = formData[id] || ""
          return (
            <div key={id} className="space-y-2">
              <label htmlFor={id} className="text-base font-semibold text-zinc-800 dark:text-zinc-200 ml-1">
                {label}
              </label>
              <SettingsInput
                id={id}
                type={type}
                disabled={isDisabled}
                value={valorDoInput}
                onChange={isDisabled ? undefined : handleInputChange}
                className={cn(isDisabled && "bg-zinc-100 text-zinc-500 cursor-not-allowed select-none dark:bg-zinc-900/50 dark:text-zinc-500")}
              />
            </div>
          )
        })}
        {isAdmin && (
          <Button type="submit" disabled={salvando} className="cursor-pointer mt-4 h-12 rounded-lg bg-[#23304c] px-8 text-lg font-bold transition-all hover:scale-[1.02] shadow-md">
            <Save className="size-5" />
            {salvando ? "Salvando..." : "Salvar Alterações"}
          </Button>
        )}
      </form>
    </div>
  )
}

function AppearanceSettings({ darkMode, onDarkModeChange }) {
  return (
    <div className="max-w-2xl space-y-6">
      <SectionTitle title="Aparência" description="Personalize o visual do seu espaço de trabalho." />
      <div className="flex min-h-20 items-center justify-between gap-6 rounded-2xl border border-zinc-200 bg-white px-8 py-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-100">Modo Escuro</h3>
          <p className="text-base font-medium text-zinc-500 dark:text-zinc-400">
            Alterne entre os temas claro e escuro para melhor conforto visual.
          </p>
        </div>
        <Switch
          checked={darkMode}
          onCheckedChange={onDarkModeChange}
          aria-label="Ativar modo escuro"
          className="cursor-pointer scale-125 data-checked:bg-[var(--status-neutral-text)] data-unchecked:bg-[#c3c7c8] dark:data-checked:bg-[#7d95c6] dark:data-unchecked:bg-[#636f87]"
        />
      </div>
    </div>
  )
}

const passwordRulesList = [
  { label: "Pelo menos 1 caractere especial (como !#$%@)", test: (v) => /[!@#$%^&*(),.?":{}|<>_\-=\[\];'\\/]/.test(v) },
  { label: "Pelo menos 1 letra maiúscula (A-Z)", test: (v) => /[A-Z]/.test(v) },
  { label: "No mínimo 8 caracteres", test: (v) => v.length >= 8 },
]

function PasswordRuleList({ password }) {
  const hasPassword = password.length > 0
  return (
    <ul className="space-y-1.5 pt-2 text-sm font-medium">
      {passwordRulesList.map(({ label, test }) => {
        const isValid = test(password)
        return (
          <li
            key={label}
            className={cn(
              "flex items-center gap-2 text-zinc-500 dark:text-zinc-400",
              hasPassword && (isValid ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")
            )}
          >
            <span className="text-lg">{isValid ? "✓" : "○"}</span>
            {label}
          </li>
        )
      })}
    </ul>
  )
}

function SecuritySettings({ role }) {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [deletando, setDeletando] = useState(false)
  const [confirmCNPJ, setConfirmCNPJ] = useState("")
  const [confirmPasswordDelete, setConfirmPasswordDelete] = useState("")
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false)
  const showDeleteAccount = role === "admin"
  const senhasNaoBatem = confirmPassword.length > 0 && newPassword !== confirmPassword

  async function handleSubmit(e) {
    e.preventDefault()
    if (senhasNaoBatem) { toast("As senhas digitadas não estão iguais!"); return }
    setCarregando(true)
    try {
      const response = await apiFetch('/api/auth/trocarSenha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senhaAtual: currentPassword, novaSenha: newPassword, confirmacaoNovaSenha: confirmPassword })
      })
      if (response.sucesso) {
        toast("Senha alterada com sucesso!")
        setCurrentPassword(""); setNewPassword(""); setConfirmPassword("")
      } else {
        toast("Erro ao alterar senha. Verifique os requisitos.")
      }
    } catch (error) {
      console.error("Erro ao trocar senha:", error)
      toast("Ocorreu um erro ao tentar alterar a senha.")
    } finally {
      setCarregando(false)
    }
  }

  async function handleDeletarContar() {
    if (!confirmCNPJ || !confirmPasswordDelete) { toast("Por favor, preencha o CNPJ e a senha para confirmar."); return }
    const confirmar = window.confirm("ATENÇÃO: Você está prestes a deletar sua conta de Administrador. Isso apagará PERMANENTEMENTE todos os dados da sua empresa e de seus funcionários. Deseja mesmo continuar?")
    if (!confirmar) return
    setDeletando(true)
    try {
      const response = await apiFetch('/api/usuarios/deletarEmpresa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cnpj: confirmCNPJ, senhaAdmin: confirmPasswordDelete })
      })
      if (response.sucesso) {
        toast.success("Conta e empresa excluídas com sucesso! Volte quando quiser, Prodsync está sempre pronto para sincronizar sua fábrica!")
        setTimeout(() => { localStorage.removeItem("token"); window.location.href = "/" }, 2000)
      } else {
        toast.error("Não foi possível deletar a conta. Tente novamente.")
      }
    } catch (error) {
      console.error("Erro ao deletar conta:", error)
      toast.error("Erro interno ao tentar excluir a conta.")
    } finally {
      setDeletando(false)
    }
  }

  function aplicarMascaraCNPJ(valor) {
    let v = valor.replace(/\D/g, "")
    v = v.replace(/^(\d{2})(\d)/, "$1.$2")
    v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    v = v.replace(/\.(\d{3})(\d)/, ".$1/$2")
    v = v.replace(/(\d{4})(\d)/, "$1-$2")
    return v.substring(0, 18)
  }

  return (
    <div className="max-w-3xl space-y-10">
      <SectionTitle title="Segurança" description="Proteja sua conta com credenciais robustas e autenticação segura." />

      <form className="space-y-8" onSubmit={handleSubmit}>
        <div className="space-y-3">
          <label htmlFor="senhaAtual" className="text-base font-semibold text-zinc-950 dark:text-zinc-100 ml-1">Senha Atual</label>
          <div className="relative max-w-md">
            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-zinc-400" />
            <SettingsInput
              id="senhaAtual"
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="pl-12 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
            >
              {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="grid max-w-2xl gap-8 sm:grid-cols-2">
          <div className="space-y-3">
            <label htmlFor="novaSenha" className="text-base font-semibold text-zinc-950 dark:text-zinc-100 ml-1">Nova Senha</label>
            <div className="relative">
              <SettingsInput
                id="novaSenha"
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
              >
                {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div className="space-y-3">
            <label htmlFor="confirmarSenha" className="text-base font-semibold text-zinc-950 dark:text-zinc-100 ml-1">Confirmar Nova Senha</label>
            <div className="relative">
              <SettingsInput
                id="confirmarSenha"
                value={confirmPassword}
                type={showConfirm ? "text" : "password"}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-900/40 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 max-w-2xl">
          <h4 className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2 uppercase tracking-wider">Requisitos da Senha</h4>
          <PasswordRuleList password={newPassword} />
        </div>

        <Button type="submit" className="h-12 cursor-pointer rounded-lg bg-[#23304c] px-8 text-lg font-bold transition-all hover:scale-[1.02] shadow-md" disabled={carregando || senhasNaoBatem}>
          <Save className="size-5" />
          {carregando ? "Salvando..." : "Atualizar Senha"}
        </Button>
      </form>

      {showDeleteAccount && (
        <div className="border-t border-zinc-100 pt-10 dark:border-zinc-800">
          <section className="rounded-2xl border border-red-200 bg-red-50/50 px-8 py-8 dark:border-red-900/50 dark:bg-red-950/20">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <Trash2 className="size-6" />
              <h3 className="text-xl font-bold">Deletar Conta</h3>
            </div>
            <p className="mt-3 max-w-2xl text-base font-medium text-zinc-600 dark:text-zinc-300">
              Excluir permanentemente sua conta de Administrador e todos os dados da empresa. Esta ação é irreversível e todos os dados de funcionários e máquinas serão perdidos.
            </p>
            {!mostrarConfirmacao ? (
              <Button type="button" variant="destructive" size="lg" onClick={() => setMostrarConfirmacao(true)}
                className="mt-6 h-12 rounded-lg bg-red-600 px-8 text-base font-bold text-white hover:bg-red-700 shadow-sm transition-all">
                Deletar Conta da Empresa
              </Button>
            ) : (
              <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-500">
                <p className="text-base font-semibold text-red-700 dark:text-red-400 mb-4">Para confirmar a exclusão permanente, preencha os dados abaixo:</p>
                <div className="mt-4 grid max-w-xl gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="deleteCnpj" className="text-sm font-bold text-zinc-700 dark:text-zinc-200 ml-1">CNPJ da Empresa</label>
                    <SettingsInput id="deleteCnpj" placeholder="00.000.000/0000-00" value={confirmCNPJ}
                      onChange={(e) => setConfirmCNPJ(aplicarMascaraCNPJ(e.target.value))} />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="deletePassword" className="text-sm font-bold text-zinc-700 dark:text-zinc-200 ml-1">Senha de Administrador</label>
                    <SettingsInput id="deletePassword" type="password" placeholder="Confirme sua senha"
                      value={confirmPasswordDelete} onChange={(e) => setConfirmPasswordDelete(e.target.value)} />
                  </div>
                </div>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Button type="button" variant="destructive" onClick={handleDeletarContar}
                    disabled={deletando || !confirmCNPJ || !confirmPasswordDelete}
                    className="h-12 rounded-lg bg-red-600 px-8 text-base font-bold text-white hover:bg-red-700 shadow-md transition-all">
                    {deletando ? "Excluindo Dados..." : "Confirmar Exclusão Permanente"}
                  </Button>
                  <Button type="button" variant="outline" disabled={deletando}
                    onClick={() => { setMostrarConfirmacao(false); setConfirmCNPJ(""); setConfirmPasswordDelete("") }}
                    className="h-12 rounded-lg px-8 text-base font-bold border-zinc-300 hover:bg-zinc-100 transition-all">
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  )
}

export default function SettingsPage({ role = "operator" }) {
  const isAdmin = role === "admin"
  const tabs = useMemo(() => (isAdmin ? adminTabs : userTabs), [isAdmin])
  const [activeTab, setActiveTab] = useState(tabs[0].id)
  const [darkMode, setDarkMode] = useState(getInitialDarkMode)

  useEffect(() => { setActiveTab(tabs[0].id) }, [tabs])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
    window.localStorage.setItem("prodsync-theme", darkMode ? "dark" : "light")
  }, [darkMode])

  return (
    <PageLayout>
      <div className="flex w-full max-w-6xl flex-col gap-7 pb-10">
        <header>
          <h1 className="text-3xl font-bold text-zinc-950 dark:text-zinc-100">Configurações</h1>
          <p className="text-lg font-medium text-zinc-500 dark:text-zinc-400">
            Gerencie suas informações da conta e preferências.
          </p>
        </header>

        <section className="flex flex-col sm:flex-row h-auto sm:h-[700px] w-full overflow-hidden rounded-lg border border-zinc-100 bg-white/75 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/90">
          <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />
          <div className="flex-1 overflow-y-auto p-5 sm:p-10 custom-scrollbar min-h-[400px]">
            {activeTab === "conta" && <AccountSettings role={role} />}
            {activeTab === "aparencia" && <AppearanceSettings darkMode={darkMode} onDarkModeChange={setDarkMode} />}
            {activeTab === "seguranca" && <SecuritySettings role={role} />}
          </div>
        </section>
      </div>
    </PageLayout>
  )
}
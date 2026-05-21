"use client"

import { useEffect, useMemo, useState } from "react"
import { KeyRound, LockKeyhole, Palette, Save, Trash2, UserRound } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

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
  { id: "id", label: "ID" },
  { id: "emailEmpresa", label: "Email da Empresa", type: "email" },
  { id: "telefoneEmpresa", label: "Telefone da Empresa" },
  { id: "enderecoEmpresa", label: "Endereço da Empresa" },
  { id: "cpfRepresentante", label: "CPF do Representante" },
]

const userAccountFields = [
  { id: "id", label: "ID" },
  { id: "nome", label: "Nome" },
  { id: "cpf", label: "CPF" },
  { id: "cargo", label: "Cargo" },
  { id: "email", label: "E-mail", type: "email" },
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

  if (storedTheme) {
    return storedTheme === "dark"
  }

  return document.documentElement.classList.contains("dark")
}

function SettingsSidebar({ activeTab, onTabChange, tabs }) {
  return (
    <aside className="w-full border-b border-zinc-100 p-4 dark:border-zinc-800 sm:w-44 sm:border-b-0 sm:border-r">
      <nav className="flex gap-2 overflow-x-auto sm:flex-col sm:overflow-visible">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id

          return (
            <button
              key={id}
              type="button"
              onClick={() => onTabChange(id)}
              className={cn(
                "flex h-7 shrink-0 items-center gap-2 rounded-md px-3 text-left text-sm font-semibold text-zinc-950 transition-colors dark:text-zinc-100",
                "hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 dark:hover:bg-zinc-800",
                isActive && "bg-zinc-100 dark:bg-zinc-800"
              )}
            >
              <Icon className="size-4 text-zinc-800 dark:text-zinc-200" />
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
    <div className="space-y-0.5">
      <h2 className="text-base font-bold text-zinc-950 dark:text-zinc-100">{title}</h2>
      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{description}</p>
    </div>
  )
}

function SettingsInput(props) {
  return (
    <Input
      {...props}
      className={cn(
        "h-7 rounded-md border-zinc-100 bg-white text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100",
        props.className
      )}
    />
  )
}

function AccountSettings({ role }) {
  const isAdmin = role === "admin"
  const fields = isAdmin ? adminAccountFields : userAccountFields
  return (
    <div className="max-w-sm space-y-4">
      <SectionTitle
        title="Informações da Conta"
        description={isAdmin ? "Atualize suas informações pessoais" : "Visualização dos dados do seu perfil"}
      />

      <form className="space-y-3">
        {fields.map(({ id, label, type = "text" }) => {
          const isDisabled = !isAdmin || id === "id"

          return (
            <div key={id} className="space-y-1">
              <label htmlFor={id} className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
                {label}
              </label>
              <SettingsInput
                id={id}
                type={type}
                disabled={isDisabled}
                readOnly={isDisabled}
                className={cn(
                  isDisabled && "bg-zinc-100 text-zinc-400 cursor-not-allowed select-none dark:bg-zinc-900 dark:text-zinc-500"
                )}
              />
            </div>
          )
        })}

        {isAdmin && (
          <Button type="button" className="mt-1 h-8 rounded-md bg-[#23304c] px-3 text-sm font-bold">
            <Save className="size-4" />
            Salvar Alterações
          </Button>
        )}
      </form>
    </div>
  )
}

function AppearanceSettings({ darkMode, onDarkModeChange }) {
  return (
    <div className="max-w-xl space-y-3">
      <SectionTitle
        title="Aparência"
        description="Personalize o visual do seu espaço."
      />

      <div className="flex min-h-14 items-center justify-between gap-4 rounded-lg border border-zinc-300 bg-white px-4 py-3 dark:border-zinc-700 dark:bg-zinc-950">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-zinc-950 dark:text-zinc-100">Modo Escuro</h3>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Alterne entre os temas claro e escuro.
          </p>
        </div>
        <Switch
          checked={darkMode}
          onCheckedChange={onDarkModeChange}
          aria-label="Ativar modo escuro"
          className="data-checked:bg-[#636f87] data-unchecked:bg-[#c3c7c8] dark:data-checked:bg-[#7d95c6] dark:data-unchecked:bg-[#636f87]"
        />
      </div>
    </div>
  )
}

function PasswordRuleList({ password }) {
  const hasPassword = password.length > 0

  return (
    <ul className="space-y-0.5 pt-1 text-[10px] font-medium">
      {passwordRules.map(({ label, test }) => {
        const isValid = test(password)

        return (
          <li
            key={label}
            className={cn(
              "text-zinc-500 dark:text-zinc-400",
              hasPassword && (isValid ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")
            )}
          >
            {isValid ? "✓" : "○"} {label}
          </li>
        )
      })}
    </ul>
  )
}

function SecuritySettings({ role }) {
  const [newPassword, setNewPassword] = useState("")
  const showDeleteAccount = role === "admin"

  return (
    <div className="max-w-2xl space-y-5">
      <SectionTitle
        title="Segurança"
        description="Proteja sua conta com credenciais robustas."
      />

      <form className="space-y-3">
        <div className="space-y-1">
          <label htmlFor="senhaAtual" className="text-xs font-bold text-zinc-950 dark:text-zinc-100">
            Senha Atual
          </label>
          <div className="relative max-w-sm">
            <LockKeyhole className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
            <SettingsInput id="senhaAtual" type="password" className="pl-8" />
          </div>
        </div>

        <div className="grid max-w-xl gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="novaSenha" className="text-xs font-bold text-zinc-950 dark:text-zinc-100">
              Nova Senha
            </label>
            <SettingsInput
              id="novaSenha"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="confirmarSenha" className="text-xs font-bold text-zinc-950 dark:text-zinc-100">
              Confirmar Nova Senha
            </label>
            <SettingsInput id="confirmarSenha" type="password" />
          </div>
        </div>

        <PasswordRuleList password={newPassword} />

        <Button type="button" className="h-8 rounded-md bg-[#23304c] px-3 text-sm font-bold">
          <Save className="size-4" />
          Salvar Senha
        </Button>
      </form>

      {showDeleteAccount ? (
        <div className="border-t border-zinc-100 pt-4 dark:border-zinc-800">
          <section className="rounded-lg border border-red-400 bg-red-50 px-4 py-3 dark:border-red-500/70 dark:bg-red-950/30">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-300">
              <Trash2 className="size-4" />
              <h3 className="text-sm font-bold">Deletar Conta</h3>
            </div>
            <p className="mt-2 max-w-lg text-xs font-medium text-zinc-600 dark:text-zinc-300">
              Excluir permanentemente sua conta e todos os dados da empresa. Esta ação é irreversível.
            </p>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="mt-3 h-7 rounded-md bg-red-100 px-4 text-xs font-bold text-red-600 hover:bg-red-200 dark:bg-red-500/20 dark:text-red-200 dark:hover:bg-red-500/30"
            >
              Excluir Conta
            </Button>
          </section>
        </div>
      ) : null}
    </div>
  )
}

export default function SettingsPage({ role = "operator" }) {
  const isAdmin = role === "admin"
  const tabs = useMemo(() => (isAdmin ? adminTabs : userTabs), [isAdmin])
  const [activeTab, setActiveTab] = useState(tabs[0].id)
  const [darkMode, setDarkMode] = useState(getInitialDarkMode)

  useEffect(() => {
    setActiveTab(tabs[0].id)
  }, [tabs])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
    window.localStorage.setItem("prodsync-theme", darkMode ? "dark" : "light")
  }, [darkMode])

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-7 pb-10">
      <header>
        <h1 className="text-3xl font-bold text-zinc-950 dark:text-zinc-100">Configurações</h1>
        <p className="text-base font-medium text-zinc-500 dark:text-zinc-400">
          Gerencie suas informações da conta e preferências.
        </p>
      </header>

      <section className="flex min-h-[350px] overflow-hidden rounded-xl border border-zinc-100 bg-white/75 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/90">
        <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />

        <div className="flex-1 p-4 sm:p-6">
          {activeTab === "conta" ? <AccountSettings role={role} /> : null}
          {activeTab === "aparencia" ? (
            <AppearanceSettings darkMode={darkMode} onDarkModeChange={setDarkMode} />
          ) : null}
          {activeTab === "seguranca" ? <SecuritySettings role={role} /> : null}
        </div>
      </section>
    </div>
  )
}

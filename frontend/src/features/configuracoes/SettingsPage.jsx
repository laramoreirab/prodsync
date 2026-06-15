"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { KeyRound, LockKeyhole, Palette, Save, Trash2, Upload, UserRound } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { apiFetch } from "@/lib/api"
import { toast } from "sonner"
import { PageLayout } from "@/components/AnimatedComponents"
import { usuariosCrudService } from "@/services/usuariosCrudService"

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

const defaultAvatarSrc = "/userdefault.svg"

function resolverImagemPerfil(imagem) {
  if (!imagem || imagem === "null") return defaultAvatarSrc
  if (imagem.startsWith("http")) return imagem

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || ""
  const baseUrl = apiUrl.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl

  if (imagem.startsWith("/uploads/")) return `${baseUrl}${imagem}`

  return `${baseUrl}/uploads/imagens/${imagem}`
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

function ProfilePhotoSelector({ fotoPerfil, inputRef, onSelect }) {
  const hasPreview = Boolean(fotoPerfil?.preview)

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 py-8 sm:min-h-64 lg:min-h-full lg:flex-1 lg:translate-y-7 lg:py-0">
      <input
        type="file"
        ref={inputRef}
        onChange={onSelect}
        accept=".jpg, .jpeg, .png, .webp, image/jpeg, image/png, image/webp"
        className="hidden"
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        aria-label="Selecionar foto de perfil"
        className={cn(
          "group relative flex size-56 cursor-pointer items-center justify-center bg-transparent text-zinc-500 transition-colors",
          "hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 dark:text-zinc-400 dark:hover:text-zinc-100"
        )}
      >
        <span className="absolute left-0 top-0 h-14 w-14 rounded-tl-xl border-l-2 border-t-2 border-zinc-300 transition-colors group-hover:border-zinc-500 dark:border-zinc-600 dark:group-hover:border-zinc-300" />
        <span className="absolute right-0 top-0 h-14 w-14 rounded-tr-xl border-r-2 border-t-2 border-zinc-300 transition-colors group-hover:border-zinc-500 dark:border-zinc-600 dark:group-hover:border-zinc-300" />
        <span className="absolute bottom-0 left-0 h-14 w-14 rounded-bl-xl border-b-2 border-l-2 border-zinc-300 transition-colors group-hover:border-zinc-500 dark:border-zinc-600 dark:group-hover:border-zinc-300" />
        <span className="absolute bottom-0 right-0 h-14 w-14 rounded-br-xl border-b-2 border-r-2 border-zinc-300 transition-colors group-hover:border-zinc-500 dark:border-zinc-600 dark:group-hover:border-zinc-300" />

        {hasPreview ? (
          <img
            src={fotoPerfil.preview}
            alt="Foto de perfil"
            className="size-40 rounded-full object-cover ring-2 ring-zinc-200 dark:ring-zinc-700"
            onError={(event) => {
              event.currentTarget.src = defaultAvatarSrc
            }}
          />
        ) : (
          <Upload className="size-24 stroke-[1.7]" />
        )}
      </button>

    </div>
  )
}

function AccountSettings({ role }) {
  const isAdmin = role === "admin"
  const [salvando, setSalvando] = useState(false)
  const [fotoPerfil, setFotoPerfil] = useState(null)
  const fileInputFotoRef = useRef(null)
  const previewObjectUrlRef = useRef(null)

  const [formData, setFormData] = useState({
    id: "",
    id_setor: "",
    nome: "",
    cpf: "",
    cargo: "",
    email: "",
    emailEmpresa: "",
    telefoneEmpresa: "",
    enderecoEmpresa: "",
    cpfRepresentante: ""
  })

  function limparPreviewTemporario() {
    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current)
      previewObjectUrlRef.current = null
    }
  }

  useEffect(() => {
    return () => limparPreviewTemporario()
  }, [])

  useEffect(() => {
    async function buscarDados() {
      const dadosUsuario = await apiFetch("/api/auth/perfil")
      const dadosPerfil = dadosUsuario.dados || {}
      const usuarioAdm = dadosPerfil.usuarios?.[0]
      const idUsuario = usuarioAdm?.id_usuario || dadosPerfil.id_usuario || ""
      const idSetor = dadosPerfil.id_setor ?? dadosPerfil.setor?.id_setor ?? ""
      const imagemPerfil = dadosPerfil.imagem_perfil || usuarioAdm?.imagem_perfil

      setFormData({
        id: idUsuario,
        id_setor: idSetor ? String(idSetor) : "",
        nome: dadosPerfil.nome || "",
        cpf: aplicarMascaraCPF(dadosPerfil.cpf) || "",
        cargo: dadosPerfil.tipo || "",
        email: dadosPerfil.email || "",
        emailEmpresa: dadosPerfil.email || "",
        telefoneEmpresa: aplicarMascaraTelefone(dadosPerfil.telefone) || "",
        enderecoEmpresa: dadosPerfil.endereco || "",
        cpfRepresentante: aplicarMascaraCPF(dadosPerfil.cpf_representante) || ""
      })

      setFotoPerfil(
        imagemPerfil
          ? {
            raw: null,
            preview: resolverImagemPerfil(imagemPerfil),
            nome: "Imagem atual"
          }
          : null
      )
    }
    buscarDados()
  }, [])

  function handleFotoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Selecione uma imagem valida.")
      e.target.value = ""
      return
    }

    limparPreviewTemporario()
    const preview = URL.createObjectURL(file)
    previewObjectUrlRef.current = preview

    setFotoPerfil({
      raw: file,
      preview,
      nome: file.name
    })
  }

  async function handleInputChange(e) {
    let { id, value } = e.target
    if (id === "telefoneEmpresa") {
      value = aplicarMascaraTelefone(value)
    } else if (id === "cpfRepresentante") {
      value = aplicarMascaraCPF(value)
    }
    setFormData((dadosAnteriores) => ({ ...dadosAnteriores, [id]: value }))
  }

  async function salvarFotoPerfilSelecionada() {
    if (!formData.id || !fotoPerfil?.raw) return

    const payload = new FormData()
    payload.append("imagem_perfil", fotoPerfil.raw)
    if (formData.id_setor) payload.append("id_setor", formData.id_setor)

    const response = await usuariosCrudService.update(formData.id, payload)
    const imagemAtualizada = response?.dados?.imagem_perfil

    if (imagemAtualizada) {
      limparPreviewTemporario()
      setFotoPerfil({
        raw: null,
        preview: resolverImagemPerfil(imagemAtualizada),
        nome: "Imagem atual"
      })
    } else {
      setFotoPerfil((fotoAtual) => fotoAtual ? { ...fotoAtual, raw: null, nome: "Imagem atual" } : fotoAtual)
    }

    if (fileInputFotoRef.current) fileInputFotoRef.current.value = ""
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
      if (!isAdmin) {
        await salvarFotoPerfilSelecionada()
        toast.success("Alterações salvas com sucesso!")
        return
      }

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
        if (response.dados) {
          setFormData((dadosAnteriores) => ({
            ...dadosAnteriores,
            emailEmpresa: response.dados.email || dadosAnteriores.emailEmpresa,
            telefoneEmpresa: aplicarMascaraTelefone(response.dados.telefone) || aplicarMascaraTelefone(dadosAnteriores.telefoneEmpresa),
            enderecoEmpresa: response.dados.endereco || dadosAnteriores.enderecoEmpresa,
            cpfRepresentante: aplicarMascaraCPF(response.dados.cpf_representante) || aplicarMascaraCPF(dadosAnteriores.cpfRepresentante),
          }))
        }
        await salvarFotoPerfilSelecionada()
        toast.success("Alterações salvas com sucesso!")
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
    <div className="flex w-full max-w-3xl flex-col gap-6 lg:flex-row lg:items-stretch lg:justify-between">
      <div className="w-full max-w-sm space-y-4">
      <SectionTitle
        title="Informações da Conta"
        description={isAdmin ? "Atualize suas informações pessoais" : "Visualização dos dados do seu perfil"}
      />
      <form className="space-y-3" onSubmit={handleSubmitPerfil}>
        {fields.map(({ id, label, type = "text", readOnly }) => {
          const isDisabled = !isAdmin || readOnly
          const valorDoInput = formData[id] || ""
          return (
            <div key={id} className="space-y-1">
              <label htmlFor={id} className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
                {label}
              </label>
              <SettingsInput
                id={id}
                type={type}
                disabled={isDisabled}
                value={valorDoInput}
                onChange={isDisabled ? undefined : handleInputChange}
                className={cn(isDisabled && "bg-zinc-100 text-black-400 cursor-not-allowed select-none dark:bg-zinc-900 dark:text-zinc-500")}
              />
            </div>
          )
        })}
        {(isAdmin || fotoPerfil?.raw) && (
          <Button type="submit" disabled={salvando} className="mt-1 h-8 rounded-md bg-[#23304c] px-3 text-sm font-bold">
            <Save className="size-4" />
            {salvando ? "Salvando..." : "Salvar Alterações"}
          </Button>
        )}
      </form>
      </div>

      <ProfilePhotoSelector
        fotoPerfil={fotoPerfil}
        inputRef={fileInputFotoRef}
        onSelect={handleFotoChange}
      />
    </div>
  )
}

function AppearanceSettings({ darkMode, onDarkModeChange }) {
  return (
    <div className="max-w-xl space-y-3">
      <SectionTitle title="Aparência" description="Personalize o visual do seu espaço." />
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
          className="data-checked:bg-[var(--status-neutral-text)] data-unchecked:bg-[#c3c7c8] dark:data-checked:bg-[#7d95c6] dark:data-unchecked:bg-[#636f87]"
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
    <ul className="space-y-0.5 pt-1 text-[10px] font-medium">
      {passwordRulesList.map(({ label, test }) => {
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
  const [confirmPassword, setConfirmPassword] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [carregando, setSincronizando] = useState(false)
  const [deletando, setDeletando] = useState(false)
  const [confirmCNPJ, setConfirmCNPJ] = useState("")
  const [confirmPasswordDelete, setConfirmPasswordDelete] = useState("")
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false)
  const showDeleteAccount = role === "admin"
  const senhasNaoBatem = confirmPassword.length > 0 && newPassword !== confirmPassword

  async function handleSubmit(e) {
    e.preventDefault()
    if (senhasNaoBatem) { toast("As senhas digitadas não estão iguais!"); return }
    setSincronizando(true)
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
      setSincronizando(false)
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
        toast.success("Conta e empresa excluídas com sucesso! Volte quando quiser, Prodsync está sempre pronto para te sincronizar!")
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
    <div className="max-w-2xl space-y-5">
      <SectionTitle title="Segurança" description="Proteja sua conta com credenciais robustas." />
      <form className="space-y-3" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label htmlFor="senhaAtual" className="text-xs font-bold text-zinc-950 dark:text-zinc-100">Senha Atual</label>
          <div className="relative max-w-sm">
            <LockKeyhole className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
            <SettingsInput id="senhaAtual" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="pl-8" />
          </div>
        </div>
        <div className="grid max-w-xl gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="novaSenha" className="text-xs font-bold text-zinc-950 dark:text-zinc-100">Nova Senha</label>
            <SettingsInput id="novaSenha" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label htmlFor="confirmarSenha" className="text-xs font-bold text-zinc-950 dark:text-zinc-100">Confirmar Nova Senha</label>
            <SettingsInput id="confirmarSenha" value={confirmPassword} type="password" onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
        </div>
        <PasswordRuleList password={newPassword} />
        <Button type="submit" className="h-8 rounded-md bg-[#23304c] px-3 text-sm font-bold" disabled={carregando || senhasNaoBatem}>
          <Save className="size-4" />
          {carregando ? "Salvando..." : "Salvar Senha"}
        </Button>
      </form>

      {showDeleteAccount && (
        <div className="border-t border-zinc-100 pt-4 dark:border-zinc-800">
          <section className="rounded-lg border border-red-400 bg-red-50 px-4 py-4 dark:border-red-500/70 dark:bg-red-950/30">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-300">
              <Trash2 className="size-4" />
              <h3 className="text-sm font-bold">Deletar Conta da Empresa</h3>
            </div>
            <p className="mt-2 max-w-lg text-xs font-medium text-zinc-600 dark:text-zinc-300">
              Excluir permanentemente sua conta de Administrador e todos os dados da empresa. Esta ação é irreversível.
            </p>
            {!mostrarConfirmacao ? (
              <Button type="button" variant="destructive" size="sm" onClick={() => setMostrarConfirmacao(true)}
                className="mt-4 h-8 rounded-md bg-red-100 px-4 text-xs font-bold text-red-600 hover:bg-red-200 dark:bg-red-500/20 dark:text-red-200 dark:hover:bg-red-500/30">
                Excluir Conta
              </Button>
            ) : (
              <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <p className="text-xs font-bold text-red-600 dark:text-red-400">Para confirmar, preencha os dados abaixo:</p>
                <div className="mt-3 grid max-w-md gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label htmlFor="deleteCnpj" className="text-xs font-bold text-zinc-600 dark:text-zinc-100">CNPJ da Empresa</label>
                    <SettingsInput id="deleteCnpj" placeholder="00.000.000/0000-00" value={confirmCNPJ} className="placeholder:text-xs text-xs"
                      onChange={(e) => setConfirmCNPJ(aplicarMascaraCNPJ(e.target.value))} />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="deletePassword" className="text-xs font-bold text-zinc-600 dark:text-zinc-100">Senha de Administrador</label>
                    <SettingsInput id="deletePassword" type="password" placeholder="Digite sua senha" className="placeholder:text-xs text-xs"
                      value={confirmPasswordDelete} onChange={(e) => setConfirmPasswordDelete(e.target.value)} />
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <Button type="button" variant="destructive" onClick={handleDeletarContar} size="sm"
                    disabled={deletando || !confirmCNPJ || !confirmPasswordDelete}
                    className="h-8 rounded-md bg-red-600 px-4 text-xs font-bold text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700">
                    {deletando ? "Excluindo..." : "Confirmar Exclusão"}
                  </Button>
                  <Button type="button" variant="outline" size="sm" disabled={deletando}
                    onClick={() => { setMostrarConfirmacao(false); setConfirmCNPJ(""); setConfirmPasswordDelete("") }}
                    className="h-8 rounded-md px-4 text-xs font-bold">
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
            {activeTab === "conta" && <AccountSettings role={role} />}
            {activeTab === "aparencia" && <AppearanceSettings darkMode={darkMode} onDarkModeChange={setDarkMode} />}
            {activeTab === "seguranca" && <SecuritySettings role={role} />}
          </div>
        </section>
      </div>
    </PageLayout>
  )
}

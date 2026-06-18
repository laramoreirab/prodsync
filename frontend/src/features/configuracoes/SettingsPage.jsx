"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { KeyRound, LockKeyhole, Palette, Save, Pencil, Trash2, Upload, UserRound, EyeOff, Eye, CircleX, CircleCheck, Loader2 } from "lucide-react"

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
  { id: "telefoneEmpresa", label: "Telefone da Empresa" },
  { id: "emailEmpresa", label: "Email da Empresa", type: "email" },
  { id: "cpfRepresentante", label: "CPF do Representante" },
  { id: "enderecoEmpresa", label: "Endereço da Empresa" },
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

const defaultAvatarSrc = "/userdefault.png"

function resolverImagemPerfil(imagem) {
  if (!imagem || imagem === "null") return defaultAvatarSrc
  if (imagem.startsWith("http")) return imagem

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || ""
  const baseUrl = apiUrl.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl

  if (imagem.startsWith("/uploads/")) return `${baseUrl}${imagem}`

  return `${baseUrl}/uploads/imagens/${imagem}`
}

function LoadingOverlay({ message = "Sincronizando Dados..." }) {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px] dark:bg-zinc-950/60">
      <div className="flex flex-col items-center gap-3">
        <div className="relative flex items-center justify-center">
          <Loader2 className="size-12 animate-spin text-[#154ecb]" />
        </div>
        <p className="animate-pulse text-base font-bold text-zinc-700 dark:text-zinc-200">
          {message}
        </p>
      </div>
    </div>
  )
}

function SettingsSidebar({ activeTab, onTabChange, tabs }) {
  return (
    <aside className="w-full border-b border-zinc-100 py-2 px-4 dark:border-zinc-800 sm:w-60 sm:py-4 sm:border-b-0 sm:border-r">
      <nav className="flex gap-1 overflow-x-auto pb-2 sm:flex-col sm:gap-2 sm:overflow-visible sm:pb-0 hide-scrollbar">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => onTabChange(id)}
              className={cn(
                "cursor-pointer flex h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-left text-sm font-bold transition-all",
                "hover:bg-zinc-100/80 focus-visible:outline-none dark:hover:bg-zinc-800",
                isActive
                  ? "bg-zinc-100 text-black dark:bg-zinc-800 dark:text-blue-400"
                  : "text-zinc-500 dark:text-zinc-400"
              )}
            >
              <Icon className={cn("size-5 shrink-0", isActive ? "text-black dark:text-blue-400" : "text-zinc-400")} />
              <span className="whitespace-nowrap">{label}</span>
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
      <h2 className="text-xl font-bold text-zinc-950 dark:text-zinc-100">{title}</h2>
      <p className="text-md font-medium text-zinc-500 dark:text-zinc-400">{description}</p>
    </div>
  )
}

function SettingsInput(props) {
  return (
    <Input
      {...props}
      className={cn(
        "h-9 rounded-md border-zinc-100 shadow-sm bg-white text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100",
        props.className
      )}
    />
  )
}

function ProfilePhotoSelector({ fotoPerfil, inputRef, onSelect, defaultPreview, canEdit }) {
  const hasPreview = Boolean(fotoPerfil?.preview)
  const previewUrl = hasPreview ? fotoPerfil.preview : defaultPreview || defaultAvatarSrc

  return (
    <div className="flex flex-col items-center sm:items-start lg:flex-1 lg:py-0">
      {canEdit && (
        <input
          type="file"
          ref={inputRef}
          onChange={onSelect}
          accept=".jpg, .jpeg, .png, .webp, image/jpeg, image/png, image/webp"
          className="hidden"
        />
      )}

      <div className="relative mb-2 w-fit">
        <button
          type="button"
          onClick={() => canEdit && inputRef.current?.click()}
          aria-label="Selecionar foto de perfil"
          className={cn(
            "group relative flex size-35 items-center justify-center bg-transparent text-zinc-500 transition-colors",
            canEdit ? "hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 cursor-pointer" : "cursor-default",
            "dark:text-zinc-400 dark:hover:text-zinc-100"
          )}
        >
          {hasPreview ? (
            <img
              src={previewUrl}
              alt="Foto de perfil"
              className="size-35 rounded-full object-cover block ring-2 ring-zinc-200 dark:ring-zinc-700 shadow-sm"
              onError={(event) => {
                event.currentTarget.src = defaultPreview || defaultAvatarSrc
              }}
            />
          ) : (
            <div
              role="img"
              aria-label="Foto de perfil padrão"
              className="size-35 rounded-full bg-center block ring-2 ring-zinc-200 dark:ring-zinc-700 shadow-sm"
              style={{
                backgroundImage: `url(${previewUrl})`,
                backgroundSize: '100%',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }}
            />
          )}
        </button>

        {/* botão que ativa o dropdwon  */}
        {canEdit && (
          <div className="absolute right-0 bottom-0">
            <button
              type="button"
              aria-label="Abrir opções de foto"
              className="bg-[#154ecb] hover:bg-[#0f3fb8] text-white p-2 rounded-full shadow-lg border-4 border-white dark:border-zinc-900 focus:outline-none transition-all cursor-pointer"
              onClick={(e) => {
                e.stopPropagation()
                const ev = new CustomEvent('toggle-photo-dropdown', { bubbles: true })
                window.dispatchEvent(ev)
              }}
            >
              <Pencil />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
function AccountSettings({ role }) {
  const isAdmin = role === "admin"
  const canEditPhoto = role === "admin" || role === "gestor"
  const [salvando, setSalvando] = useState(false)
  const [loading, setLoading] = useState(false)

  const [fotoPerfil, setFotoPerfil] = useState(null)
  const [defaultProcessedPreview, setDefaultProcessedPreview] = useState(null)
  const fileInputFotoRef = useRef(null)
  const previewObjectUrlRef = useRef(null)
  const dropdownRef = useRef(null)
  const [photoDropdownOpen, setPhotoDropdownOpen] = useState(false)

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
    let mounted = true
    let url = null
      ; (async () => {
        try {
          const res = await fetch('/userdefault.png')
          if (!res.ok) return
          const blob = await res.blob()
          const file = new File([blob], 'userdefault.png', { type: blob.type || 'image/png' })
          const processed = await processImageFile(file, 1024)
          url = URL.createObjectURL(processed)
          if (mounted) setDefaultProcessedPreview(url)
        } catch (err) {
          console.warn('Não foi possível processar avatar padrão:', err)
        }
      })()
    return () => {
      mounted = false
      if (url) {
        try { URL.revokeObjectURL(url) } catch (e) { }
      }
    }
  }, [])

  useEffect(() => {
    function onToggle() {
      setPhotoDropdownOpen((v) => !v)
    }

    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setPhotoDropdownOpen(false)
      }
    }

    window.addEventListener('toggle-photo-dropdown', onToggle)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      window.removeEventListener('toggle-photo-dropdown', onToggle)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    async function buscarDados() {
      setLoading(true)
      try {
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
      } catch (err) {
        console.error("Erro ao buscar dados do perfil:", err)
      } finally {
        setLoading(false)
      }
    }
    buscarDados()
  }, [])

  function handleFotoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Selecione uma imagem válida!")
      e.target.value = ""
      return
    }

    ; (async () => {
      try {
        limparPreviewTemporario()
        const processed = await processImageFile(file, 1024)
        const preview = URL.createObjectURL(processed)
        previewObjectUrlRef.current = preview

        // garantir que se envia um arquivo com nome
        const processedFile = new File([processed], file.name.replace(/\.[^.]+$/, ".png"), { type: "image/png" })

        setFotoPerfil({ raw: processedFile, preview, nome: processedFile.name })
      } catch (err) {
        console.error('Erro ao processar imagem:', err)
        toast.error('Não foi possível processar a imagem. Tente outro arquivo.')
        if (e.target) e.target.value = ""
      }
    })()
  }

  // processa a imagem no client para garantir crop/cover e remover espaços transparentes
  function processImageFile(file, outputSize = 1024) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onerror = () => reject(new Error('Erro ao ler arquivo'))
      reader.onload = () => {
        const img = new Image()
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas')
            canvas.width = outputSize
            canvas.height = outputSize
            const ctx = canvas.getContext('2d')
            ctx.fillStyle = '#ffffff'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            const scale = Math.max(canvas.width / img.width, canvas.height / img.height)
            const sw = canvas.width / scale
            const sh = canvas.height / scale
            const sx = Math.max(0, (img.width - sw) / 2)
            const sy = Math.max(0, (img.height - sh) / 2)

            ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height)

            canvas.toBlob((blob) => {
              if (!blob) return reject(new Error('Falha ao gerar imagem'))
              resolve(blob)
            }, 'image/png', 0.92)
          } catch (err) {
            reject(err)
          }
        }
        img.onerror = () => reject(new Error('Formato de imagem inválido'))
        img.src = String(reader.result)
      }
      reader.readAsDataURL(file)
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

  async function handleRemoveFoto() {
    // upload do userdefault.png como se fosse uma nova imagem
    if (!formData.id) return
    setSalvando(true)
    setPhotoDropdownOpen(false)
    try {
      const res = await fetch('/userdefault.png')
      if (!res.ok) throw new Error('Não foi possível obter imagem padrão')
      const blob = await res.blob()
      const file = new File([blob], 'userdefault.png', { type: blob.type || 'image/png' })

      const processed = await processImageFile(file, 1024)
      const processedFile = new File([processed], 'userdefault.png', { type: 'image/png' })

      const payload = new FormData()
      payload.append('imagem_perfil', processedFile)
      if (formData.id_setor) payload.append('id_setor', formData.id_setor)

      const response = await usuariosCrudService.update(formData.id, payload)
      const imagemAtualizada = response?.dados?.imagem_perfil

      if (imagemAtualizada) {
        limparPreviewTemporario()
        setFotoPerfil({ raw: null, preview: resolverImagemPerfil(imagemAtualizada), nome: 'Imagem atual' })
        toast.success('Foto substituída pela padrão')
      } else {
        setFotoPerfil((fotoAtual) => fotoAtual ? { ...fotoAtual, raw: null, preview: defaultProcessedPreview || defaultAvatarSrc, nome: 'Imagem atual' } : { raw: null, preview: defaultProcessedPreview || defaultAvatarSrc, nome: 'Imagem atual' })
        toast.success('Foto substituída pela padrão')
      }
    } catch (error) {
      console.error('Erro ao substituir foto pelo padrão:', error)
      toast.error('Erro ao remover foto. Tente novamente.')
    } finally {
      setSalvando(false)
    }
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-10 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#0f3d84]" />
        <p className="text-lg text-zinc-600 font-medium">Sincronizando dados do perfil...</p>
      </div>
    );
  }
  return (
    <div className="flex w-full max-w-4xl flex-col gap-8 lg:flex-row lg:items-start">
      <div className="w-full space-y-6">
        <SectionTitle
          title="Informações da Conta"
          description={isAdmin ? "Atualize suas informações pessoais" : "Visualize os dados do seu perfil"}
        />

        <form className="space-y-3" onSubmit={handleSubmitPerfil}>
          <div className="flex flex-col items-center gap-10 sm:flex-row sm:items-start">
            <div className="relative" ref={dropdownRef}>
              <ProfilePhotoSelector
                fotoPerfil={fotoPerfil}
                inputRef={fileInputFotoRef}
                onSelect={handleFotoChange}
                defaultPreview={defaultProcessedPreview}
                canEdit={canEditPhoto}
              />

              {canEditPhoto && photoDropdownOpen && (
                <div className="absolute left-1/2 top-full z-50 mt-2 w-48 -translate-x-1/2 rounded-md border bg-white shadow-lg animate-in fade-in zoom-in-95 duration-100">
                  <div className="flex flex-col py-2">
                    <div className="px-1">
                      <button
                        type="button"
                        onClick={() => { fileInputFotoRef.current?.click(); setPhotoDropdownOpen(false) }}
                        className="cursor-pointer flex w-full items-center gap-3 px-3 py-2 text-sm font-semibold text-zinc-700 rounded-lg transition-all duration-100 hover:bg-zinc-100"
                      >
                        <Upload className="size-4" />
                        Carregar Foto
                      </button>
                    </div>
                    <div className="px-1">
                      <button
                        type="button"
                        onClick={handleRemoveFoto}
                        className="cursor-pointer flex w-full items-center gap-3 px-3 py-2 text-sm font-semibold text-red-600 rounded-lg transition-all duration-100 hover:bg-red-50"
                      >
                        <Trash2 className="size-4" />
                        Remover foto
                      </button>
                    </div>
                  </div>


                </div>
              )}
            </div>

            <div className="flex flex-col">
              <div className="grid w-full flex-1 gap-4 sm:grid-cols-2">
                {fields.map(({ id, label, type = "text", readOnly }) => {
                  const isDisabled = !isAdmin || readOnly
                  const valorDoInput = formData[id] || ""
                  return (
                    <div key={id} className={cn("space-y-1.5", (id === "enderecoEmpresa" || id === "nome") && "sm:col-span-2")}>
                      <label htmlFor={id} className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                        {label}
                      </label>
                      <SettingsInput
                        id={id}
                        type={type}
                        disabled={isDisabled}
                        value={valorDoInput}
                        onChange={isDisabled ? undefined : handleInputChange}
                        className={cn(isDisabled && "bg-zinc-100 text-zinc-500 cursor-not-allowed dark:bg-zinc-900/50")}
                      />
                    </div>
                  )
                })}
              </div>
              <div className="flex justify-start pt-8 dark:border-zinc-800">
                {(isAdmin || fotoPerfil?.raw) && (
                  <Button type="submit" disabled={salvando} className="flex items-center cursor-pointer w-full sm:w-auto h-10 rounded-lg bg-[#23304c] px-5 text-md font-bold transition-all hover:scale-[1.01] shadow-md">
                    <Save className="mr-1 size-5" />
                    {salvando ? "Salvando..." : "Salvar Alterações"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

function AppearanceSettings({ darkMode, onDarkModeChange }) {
  return (
    <div className="max-w-xl space-y-3">
      <SectionTitle title="Aparência" description="Personalize o visual do seu espaço." />
      <div className="flex min-h-20 items-center justify-between gap-6 rounded-2xl border border-zinc-200 bg-white px-3 py-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-zinc-950 dark:text-zinc-100">Modo Escuro</h3>
          <p className="text-md font-medium text-zinc-500 dark:text-zinc-400">
            Alterne entre os temas claro e escuro.
          </p>
        </div>
        <Switch
          checked={darkMode}
          onCheckedChange={onDarkModeChange}
          aria-label="Ativar modo escuro"
          className="cursor-pointer scale-125 data-checked:bg-(--status-neutral-text) data-unchecked:bg-[#c3c7c8] dark:data-checked:bg-[#7d95c6] dark:data-unchecked:bg-[#636f87]"
        />
      </div>
    </div>
  )
}

const passwordRulesList = [
  { label: "Pelo menos 1 caractere especial (como !#$%@)", test: (v) => /[!@#$%^&*(),.?":{}|<>_\-=\[\];'\\/]/.test(v) },
  { label: "Pelo menos 1 letra maiúscula.", test: (v) => /[A-Z]/.test(v) },
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
            <span >{isValid ? <CircleCheck className="h-4 w-5" /> : <CircleX className="h-4 w-5" />}</span>
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
  const [showNew, setShowNew] = useState(false)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
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
          <label htmlFor="senhaAtual" className="text-sm font-bold text-zinc-950 dark:text-zinc-100">Senha Atual</label>
          <div className="relative max-w-sm">
            <LockKeyhole className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
            <SettingsInput id="senhaAtual" type={showCurrent ? "text" : "password"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="pl-8 pr-12" />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
            >
              {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        <div className="grid max-w-xl gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="novaSenha" className="text-sm font-bold text-zinc-950 dark:text-zinc-100">Nova Senha</label>
            <div className="relative">
              <SettingsInput id="novaSenha" type={showNew ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="pr-12" />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
              >
                {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

          </div>
          <div className="space-y-1">
            <label htmlFor="confirmarSenha" className="text-sm font-bold text-zinc-950 dark:text-zinc-100">Confirmar Nova Senha</label>
            <div className="relative">
              <SettingsInput id="confirmarSenha" value={confirmPassword} type={showConfirm ? "text" : "password"} onChange={(e) => setConfirmPassword(e.target.value)} className="pr-12" />
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
        <Button type="submit" className=" flex items-center h-10 cursor-pointer rounded-lg bg-[#23304c] px-6 text-lg font-bold transition-all hover:scale-[1.02] shadow-md" disabled={carregando || senhasNaoBatem}>
          <Save className="size-5" />
          {carregando ? "Salvando..." : "Atualizar Senha"}
        </Button>
      </form>

      {showDeleteAccount && (
        <div className="border-t border-zinc-100 pt-4 dark:border-zinc-800">
          <section className="rounded-2xl border border-red-200 bg-red-50 px-5 py-6 dark:border-red-500/70 dark:bg-red-950/30">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <Trash2 className="size-5 -translate-y-0.5" />
              <h3 className="text-xl font-bold leading-none">Deletar Conta</h3>
            </div>
            <p className="mt-2 max-w-2xl text-sm font-medium text-zinc-600 dark:text-zinc-300">
              Excluir permanentemente sua conta de Administrador e todos os dados da empresa. Esta ação é irreversível e todos os dados de funcionários e máquinas serão perdidos.</p>
            {!mostrarConfirmacao ? (
              <Button type="button" variant="destructive" size="sm" onClick={() => setMostrarConfirmacao(true)}
                className="cursor-pointer mt-6 h-9 rounded-lg bg-red-600 px-6 text-base font-bold text-white hover:bg-red-700 shadow-sm transition-all">
                Deletar Conta da Empresa
              </Button>
            ) : (
              <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <p className="text-base font-semibold text-red-700 dark:text-red-400">Para confirmar a exclusão permanente, preencha os dados abaixo:</p>
                <div className="mt-3 grid max-w-md gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="deleteCnpj" className="text-sm font-bold text-zinc-600 dark:text-zinc-100">CNPJ da Empresa</label>
                    <SettingsInput id="deleteCnpj" placeholder="00.000.000/0000-00" value={confirmCNPJ}
                      onChange={(e) => setConfirmCNPJ(aplicarMascaraCNPJ(e.target.value))} />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="deletePassword" className="text-sm font-bold text-zinc-600 dark:text-zinc-100">Senha de Administrador</label>
                    <SettingsInput id="deletePassword" type="password" placeholder="Digite sua senha"
                      value={confirmPasswordDelete} onChange={(e) => setConfirmPasswordDelete(e.target.value)} />
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button type="button" variant="destructive" onClick={handleDeletarContar} size="sm"
                    disabled={deletando || !confirmCNPJ || !confirmPasswordDelete}
                    className="cursor-pointer h-8 rounded-md bg-red-600 px-4 text-sm font-bold text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700">
                    {deletando ? "Excluindo..." : "Confirmar Exclusão"}
                  </Button>
                  <Button type="button" variant="outline" size="sm" disabled={deletando}
                    onClick={() => { setMostrarConfirmacao(false); setConfirmCNPJ(""); setConfirmPasswordDelete("") }}
                    className="cursor-pointer h-8 rounded-md px-4 text-base font-bold shadow-sm hover:bg-zinc-100 transition-all">
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
      <div className="flex w-full flex-col gap-7 py-10">
        <div className="flex flex-col gap-1 min-w-0 flex-1 pb-6">
          <div className="relative w-fit pb-1">
            <h1 className="mb-1 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-black dark:text-[#f4f8ff]">
              Configurações
            </h1>
          </div>

          <p className="text-base text-muted-foreground font-medium">
            Gerencie suas informações da conta e preferências.
          </p>
        </div>


        <section className="flex flex-col sm:flex-row min-h-125 overflow-hidden rounded-xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/90">
          <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />
          <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
            {activeTab === "conta" && <AccountSettings role={role} />}
            {activeTab === "aparencia" && <AppearanceSettings darkMode={darkMode} onDarkModeChange={setDarkMode} />}
            {activeTab === "seguranca" && <SecuritySettings role={role} />}
          </div>
        </section>
      </div>
    </PageLayout>
  )
}

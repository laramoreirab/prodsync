"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User } from "lucide-react";
import { clearAuthSession } from "@/lib/auth";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api"


const PROFILE_ITEMS = [
  { label: "Meu Perfil", icon: User },
];

const SETTINGS_ITEMS = [
  { label: "Configurações", icon: Settings },
];

const LOGOUT_ITEM = {
  label: "Sair",
  icon: LogOut,
  destructive: true,
};

const itemClass = "px-4 py-2.5 text-base cursor-pointer gap-3";

const resolverImagemPerfil = (imagem) => {
  if (!imagem) return "/userdefault.svg";
  if (imagem.startsWith("http")) return imagem;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  if (imagem.startsWith("/uploads/")) return `${apiUrl}${imagem}`;

  return `${apiUrl}/uploads/imagens/${imagem}`;
};

const ProfileDropdown = ({
  trigger,
  defaultOpen,
  align = "end",
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const settingsHref = pathname?.startsWith("/gestor")
    ? "/gestor/configuracoes"
    : pathname?.startsWith("/operador")
      ? "/operador/configuracoes"
      : "/adm/configuracoes";

  function handleLogout() {
    clearAuthSession();
    router.replace("/");
    router.refresh();
  }

  const [nomeUsuario, setNomeUsuario] = useState("")
  const [idUsuario, setIdUsuario] = useState("")
  const [avatarSrc, setAvatarSrc] = useState("/userdefault.svg")
  useEffect(()=>{
    async function buscarDados() {
      try {
        const resposta = await apiFetch('/api/auth/perfil')
        const dados = resposta?.dados || {};
        const usuarioAdm = dados.usuarios?.[0];

        setIdUsuario(usuarioAdm?.id_usuario || dados.id_usuario || "")
        setNomeUsuario(dados.nome || dados.nome_representante || "")
        setAvatarSrc(resolverImagemPerfil(dados.imagem_perfil || usuarioAdm?.imagem_perfil))
      } catch (error) {
        console.error("Erro ao buscar dados do perfil:", error)
      }
    }
    buscarDados();
  }, [])

  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger asChild>
        {typeof trigger === "function" ? trigger({ avatarSrc, nomeUsuario }) : trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 ml-3" align={align}>
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-4 px-4 py-2.5 font-normal">
            <div className="relative">
              <img src={avatarSrc} className="h-10 w-10 rounded-full object-cover" alt={nomeUsuario || "Usuario"} />
              <span className="ring-card absolute right-0 bottom-0 size-2 rounded-full bg-green-600 ring-2" />
            </div>

            <div className="flex flex-col">
              <span className="text-foreground text-lg font-semibold">
                {nomeUsuario}
              </span>
              <span className="text-muted-foreground text-sm">
                {idUsuario}
              </span>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            {SETTINGS_ITEMS.map(({ label, icon: Icon }) => (
              <DropdownMenuItem key={label} className={itemClass} asChild>
                <Link href={settingsHref}>
                  <Icon size={20} className="text-foreground" />
                  <span>{label}</span>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            variant="destructive"
            className={itemClass}
            onSelect={handleLogout}
          >
            <LOGOUT_ITEM.icon size={20} />
            <span>{LOGOUT_ITEM.label}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;

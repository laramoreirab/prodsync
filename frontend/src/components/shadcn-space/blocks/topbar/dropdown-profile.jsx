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
  useEffect(()=>{
    async function buscarDados() {
      const resposta = await apiFetch('/api/auth/perfil')
      console.log("dados para perfil:", resposta)
      setIdUsuario(resposta.dados.usuarios?.[0]?.id_usuario || resposta.dados.id_usuario || "")
      setNomeUsuario(resposta.dados.nome || resposta.dados.nome_representante || "")
    }
    buscarDados();
  }, [])

  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align={align}>
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-4 px-4 py-2.5 font-normal">
            <div className="relative">
              <img src="/userdefault.svg" className="w-10" alt="" />
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

          {PROFILE_ITEMS.map(({ label, icon: Icon }) => (
            <DropdownMenuItem key={label} className={itemClass}>
              <Link href={settingsHref} class="flex items-center gap-3">
              <Icon size={20} className="text-foreground" />
              <span>{label}</span>
              </Link>
            </DropdownMenuItem>
          ))}

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
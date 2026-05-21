"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const settingsHref = pathname?.startsWith("/gestor")
    ? "/gestor/configuracoes"
    : pathname?.startsWith("/operador")
      ? "/operador/configuracoes"
      : "/adm/configuracoes";

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
                Nome Pessoa
              </span>
              <span className="text-muted-foreground text-sm">
                emailpessoa@example.com
              </span>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {PROFILE_ITEMS.map(({ label, icon: Icon }) => (
            <DropdownMenuItem key={label} className={itemClass}>
              <Link href={settingsHref}>
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

          <DropdownMenuItem variant="destructive" className={itemClass}>
            <LOGOUT_ITEM.icon size={20} />
            <span>{LOGOUT_ITEM.label}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;

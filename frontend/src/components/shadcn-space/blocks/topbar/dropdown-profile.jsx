"use client";;
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bookmark, LogOut, ReceiptText, Settings, User } from "lucide-react";

const PROFILE_ITEMS = [
  { label: "Meu Perfil", icon: User },
  /* { label: "My Subscription", icon: Bookmark },
  { label: "My Invoice", icon: ReceiptText }, */
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
  align = "end"
}) => {
  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align={align}>
        <DropdownMenuGroup>
          {/* User Info */}
          <DropdownMenuLabel className="flex items-center gap-4 px-4 py-2.5 font-normal">
            <div className="relative">
              <img src="/userdefault.svg" className="w-10"/>
              <span
                className="ring-card absolute right-0 bottom-0 size-2 rounded-full bg-green-600 ring-2" />
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

          {/* Main Links */}
          {PROFILE_ITEMS.map(({ label, icon: Icon }) => (
            <DropdownMenuItem key={label} className={itemClass}>
              <Icon size={20} className="text-foreground" />
              <span>{label}</span>
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />

          {/* Settings */}
          <DropdownMenuGroup>
            {SETTINGS_ITEMS.map(({ label, icon: Icon }) => (
              <DropdownMenuItem key={label} className={itemClass}>
                <Icon size={20} className="text-foreground" />
                <span>{label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* Logout */}
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

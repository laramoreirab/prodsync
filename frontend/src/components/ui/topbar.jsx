'use client';

import ProfileDropdown from "@/components/shadcn-space/blocks/topbar/dropdown-profile";
import NotificationDropdown from "@/components/shadcn-space/blocks/topbar/notification-dropdown";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { BellRing } from "lucide-react";

const Header = ({
  showSidebarTrigger = false,
}) => {
  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b bg-white backdrop-blur dark:border-[#4e506f]/40 dark:bg-[#23304c]">
      <div className="flex w-full items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          {showSidebarTrigger ? (
            <>
              <SidebarTrigger className="md:hidden" />
              <Separator
                orientation="vertical"
                className="mr-1 h-4 md:hidden" />
            </>
          ) : null}

          <a href="#">
            <img
              src="/logo.png"
              alt="logo"
              className="h-10" />
          </a>
        </div>

        <div className="flex items-center gap-2.5">
          <NotificationDropdown
            defaultOpen={false}
            align="center"
            trigger={
              <BellRing className="size-6 mr-2 text-zinc-950 dark:text-zinc-100" />
            }
          />
          <ProfileDropdown
            trigger={({ avatarSrc }) => (
              <div id="profile-dropdown-trigger" className="rounded-full cursor-pointer overflow-hidden border-2 border-slate-200/50 dark:border-slate-700/50 transition-all hover:border-slate-300 dark:hover:border-slate-600">
                <img
                  src={avatarSrc}
                  className="w-8 h-8 object-cover"
                  alt="Perfil"
                  onError={(e) => {
                    e.currentTarget.src = "/userdefault.svg";
                  }}
                />
              </div>
            )} />
        </div>
      </div>
    </header>
  );
};

export default Header;

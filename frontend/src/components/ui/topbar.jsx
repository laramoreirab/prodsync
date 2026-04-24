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
    <div className="flex w-full">
      <div className="flex flex-1 flex-col">
        <header className="bg-card sticky  py-3 top-0 z-50 border-b">
          <div className="mx-auto flex items-center justify-between gap-6 px-4 py-2 sm:px-6">
            <div className="flex items-center gap-4">
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
              <BellRing className="size-6 mr-2" />
            }
          />
          <ProfileDropdown
            trigger={
              <div id="profile-dropdown-trigger" className="rounded-full cursor-pointer">
                <img src="/userdefault.svg" className="w-7"/>
              </div>
            } />
        </div>
      </div>
    </header>
  );
};

export default Header;

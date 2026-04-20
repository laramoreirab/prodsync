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
    <header className="fixed top-0 left-0 z-50 w-full border-b bg-card/95 backdrop-blur">
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

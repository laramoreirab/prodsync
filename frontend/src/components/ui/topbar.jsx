'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProfileDropdown from "@/components/shadcn-space/blocks/topbar/dropdown-profile";
import { BellRing, User } from "lucide-react";
// import { Separator } from "@/components/ui/separator";
// import {
//   NavigationMenu,
//   NavigationMenuContent,
//   NavigationMenuItem,
//   NavigationMenuLink,
//   NavigationMenuList,
//   NavigationMenuTrigger,
// } from "@/components/ui/navigation-menu";
import NotificationDropdown from "@/components/shadcn-space/blocks/topbar/notification-dropdown";

const Header = () => {
  return (
    <div className="flex min-h-dvh w-full">
      <div className="flex flex-1 flex-col">
        <header className="bg-card sticky top-0 z-50 border-b">
          <div
            className="mx-auto flex items-center justify-between gap-6 px-4 py-2 sm:px-6">
            <div className="flex items-center gap-4">
              <a href="#">
                <img
                  src="/logo.png"
                  alt="logo"
                  className="h-10" />
              </a>
              {/* <Separator orientation="vertical" />
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-xs gap-4">
                        <li>
                          <NavigationMenuLink href="#">
                            <div className="flex flex-col items-start gap-0.5!">
                              <p className="font-medium">Components</p>
                              <p className="text-muted-foreground">
                                Browse all components in the library.
                              </p>
                            </div>
                          </NavigationMenuLink>
                          <NavigationMenuLink href="#">
                            <div className="flex flex-col items-start gap-0.5!">
                              <p className="font-medium">Documentation</p>
                              <p className="text-muted-foreground">
                                Learn how to use the library.
                              </p>
                            </div>
                          </NavigationMenuLink>
                          <NavigationMenuLink href="#">
                            <div className="flex flex-col items-start gap-0.5!">
                              <p className="font-medium">Blog</p>
                              <p className="text-muted-foreground">
                                Read our latest blog posts.
                              </p>
                            </div>
                          </NavigationMenuLink>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu> */}
            </div>
            <div className="flex items-center gap-2.5">
              <NotificationDropdown
                defaultOpen={false}
                align="center"
                trigger={
                  // <div
                  //   className="rounded-full p-2 hover:bg-accent relative before:absolute before:bottom-0 before:left-1/2 before:z-10 before:w-2 before:h-2 before:rounded-full before:bg-red-500 before:top-1">
                    <BellRing className="size-5 mr-2" />
                  // </div>
                } />
              <ProfileDropdown
                trigger={
                  <div id="profile-dropdown-trigger" className="rounded-full cursor-pointer">
                    <Avatar className="size-7 rounded-full">
                      <AvatarImage src="" />
                      <AvatarFallback>
                        <User />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                } />
            </div>
          </div>
        </header>
      </div>
    </div>
  );
};

export default Header;

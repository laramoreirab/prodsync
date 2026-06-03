"use client";

import { useState, useEffect, useCallback } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import Logo from "@/assets/logo/logo";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const CollaborateButton = ({ className, href = "/cadastro" }) => (
  <Button
    asChild
    className={cn(
      "relative h-10 w-fit overflow-hidden rounded-full p-1 ps-4 pe-12 text-md font-medium transition-all duration-500 group hover:ps-12 hover:pe-4",
      className,
      "cursor-pointer",
    )}
  >
    <Link href={href}>
      <span className="relative z-10 transition-all duration-500">Cadastre-se</span>
      <span className="absolute right-1 flex h-8 w-8 items-center justify-center rounded-full bg-background text-foreground transition-all duration-500 group-hover:right-[calc(100%-36px)] group-hover:rotate-45">
        <ArrowUpRight size={16} />
      </span>
    </Link>
  </Button>
);

const Header = ({ navigationData, className }) => {
  const [sticky, setSticky] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleScroll = useCallback(() => {
    setSticky(window.scrollY >= 50);
  }, []);

  const handleResize = useCallback(() => {
    if (window.innerWidth >= 768) setIsOpen(false);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [handleScroll, handleResize]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      className={cn(
        "sticky top-0 z-50 flex h-20 w-full items-center justify-center transition-all duration-500",
        sticky
          ? "border-b border-border/40 bg-white shadow-2xl shadow-primary/5"
          : "border-b border-transparent bg-transparent",
        className,
      )}
    >
      <div
        className={cn(
          "flex h-full w-full items-center justify-between gap-3.5 px-4 transition-all duration-500 lg:gap-6",
          sticky
            ? "m-0 h-20 border border-border/40 bg-white py-2.5 shadow-2xl shadow-primary/5"
            : "h-20 border-transparent bg-transparent",
        )}
      >
        <div>
          <a href="/">
            <Logo className="gap-3" />
          </a>
        </div>

        <div>
          <NavigationMenu className="max-lg:hidden h-12 rounded-full bg-muted p-0.5">
            <NavigationMenuList className="h-10 rounded-full bg-muted px-4">
              {navigationData.map((navItem) => (
                <NavigationMenuItem key={navItem.title}>
                  <NavigationMenuLink
                    href={navItem.href}
                    className={cn(
                      "flex h-9 items-center rounded-full px-4 text-lg font-semibold tracking-normal text-muted-foreground outline outline-transparent transition-all duration-200 hover:bg-background hover:text-foreground hover:outline-border hover:shadow-xs",
                      navItem.isActive ? "text-bold" : "",
                    )}
                  >
                    {navItem.title}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex gap-4">
          <CollaborateButton className="hidden lg:flex" />

          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger id="mobile-menu-trigger">
                <span className="block rounded-full border border-border p-2">
                  <Menu width={20} height={20} />
                  <span className="sr-only">Menu</span>
                </span>
              </SheetTrigger>

              <SheetContent showCloseButton={false} side="right" className="w-full border-l-0 p-0 sm:w-96">
                <div className="flex items-center justify-between p-6">
                  <a href="#">
                    <Logo className="gap-2" />
                  </a>
                  <SheetClose id="mobile-menu-close">
                    <span className="block rounded-full border border-border p-2.5">
                      <X width={16} height={16} />
                    </span>
                  </SheetClose>
                </div>

                <div className="flex flex-col gap-12 overflow-y-auto px-6 pb-6">
                  <div className="flex flex-col gap-8">
                    <SheetTitle className="sr-only">Menu</SheetTitle>
                    <NavigationMenu orientation="vertical" className="flex-none items-start">
                      <NavigationMenuList className="flex flex-col items-start gap-3">
                        {navigationData.map((item) => (
                          <NavigationMenuItem key={item.title}>
                            <NavigationMenuLink
                              href={item.href}
                              className={cn(
                                "group/nav flex items-center p-0 text-2xl font-semibold tracking-tight transition-all hover:bg-transparent focus:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent",
                                item.isActive
                                  ? "text-primary"
                                  : "text-muted-foreground hover:translate-x-2 hover:text-foreground",
                              )}
                            >
                              <div
                                className={cn(
                                  "h-0.5 bg-primary transition-all duration-300 overflow-hidden",
                                  item.isActive
                                    ? "mr-2 w-4 opacity-100"
                                    : "w-0 opacity-0 group-hover/nav:mr-2 group-hover/nav:w-4 group-hover/nav:opacity-100",
                                )}
                              />
                              {item.title}
                            </NavigationMenuLink>
                          </NavigationMenuItem>
                        ))}
                      </NavigationMenuList>
                    </NavigationMenu>

                    <div className="w-fit">
                      <CollaborateButton />
                    </div>
                  </div>

                  <div className="mt-auto flex flex-col gap-4">
                    <p className="text-sm text-muted-foreground">© 2026 ProdSync</p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;

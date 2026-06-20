"use client";

import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import LoginForm from "@/components/ui/formLogin";
import BrandSlider from "./brand-slider";

function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative z-10 flex w-full flex-col items-center overflow-hidden lg:h-[calc(100vh-80px)] lg:flex-row">
        <div className="relative flex h-auto w-full items-center pb-6 pt-10 lg:w-1/2 lg:pb-10 lg:pt-20">
          <div className="container relative z-10 mx-auto lg:mx-0 lg:ml-20">
            <div className="mx-auto flex max-w-5xl flex-col gap-8 lg:mx-0">
              <div className="relative flex flex-col items-center gap-4 text-center sm:gap-6">
                <motion.h1
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className="font-medium leading-[0.32]"
                >
                  <span
                    className="block whitespace-nowrap text-[clamp(5.5rem,14vw,8rem)] text-primary sm:text-[8rem] md:text-[8rem] lg:text-[10rem] xl:text-[12rem] leading-[0.8]"
                    style={{ fontFamily: "var(--font-virtual)" }}
                  >
                    Produtividade
                  </span>
                  <span className="block text-4xl font-semibold lg:text-7xl md:text-5xl">
                    sem pausa.
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.1, ease: "easeInOut" }}
                  className="max-w-5xl text-lg font-semibold text-muted-foreground"
                >
                  Sua fábrica sincronizada em tempo <br /> real e sob controle.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: "easeInOut" }}
                className="flex flex-col items-center justify-center gap-8 md:flex-row"
              >
                <Button
                  asChild
                  className="relative h-12 w-fit cursor-pointer overflow-hidden rounded-full bg-primary p-1 ps-6 pe-14 text-lg font-semibold transition-all duration-500 group hover:ps-14 hover:pe-6"
                >
                  <Link href="/cadastro" aria-label="Cadastre-se no ProdSync">
                    <span className="relative z-10 transition-all duration-500">Cadastre-se</span>
                    <span aria-hidden="true" className="absolute right-1 flex h-10 w-10 items-center justify-center rounded-full bg-background text-foreground transition-all duration-500 group-hover:right-[calc(100%-44px)] group-hover:rotate-45">
                      <ArrowUpRight aria-hidden="true" size={16} />
                    </span>
                  </Link>
                </Button>
              </motion.div>

              <div className="relative flex w-full flex-col items-center text-center">
                <motion.div
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2, ease: "easeInOut" }}
                  className="flex flex-col gap-3"
                >
                  <div className="relative flex justify-center py-3 md:py-4">
                    <div className="flex items-center justify-center gap-4">
                      <div className="hidden h-0.5 w-40 bg-cinza-escuro opacity-20 md:block" />
                      <p className="relative z-10 bg-white px-4 text-base font-semibold tracking-tight text-cinza-escuro">
                        Utilizado por mais de 100 grandes
                        <br />
                        empresas ao redor do mundo
                      </p>
                      <div className="hidden h-0.5 w-40 bg-cinza-escuro opacity-20 md:block" />
                    </div>
                  </div>
                </motion.div>
              </div>

              <BrandSlider />
            </div>
          </div>
        </div>

        <section className="relative flex w-full items-center justify-center py-8 sm:py-16 lg:w-1/2 lg:py-20">
          <div className="flex w-full justify-center px-4 lg:mr-20 lg:p-0">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2, ease: "easeInOut" }}
            >
              <LoginForm />
            </motion.div>
          </div>
        </section>
      </div>
    </section>
  );
}

export default HeroSection;

"use client";;
import { Instrument_Serif } from "next/font/google";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import BrandSlider from "@/components/shadcn-space/blocks/hero-01/brand-slider";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
});

const virtual = 2; /* fazer dowloand da fonte correta */

const brandList = [
    {
      image: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-1.svg",
      lightimg: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-light-1.svg",
      name: "Brand 1",
    },
    {
      image: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-2.svg",
      lightimg: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-light-2.svg",
      name: "Brand 2",
    },
    {
      image: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-3.svg",
      lightimg: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-light-3.svg",
      name: "Brand 3",
    },
    {
      image: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-4.svg",
      lightimg: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-light-4.svg",
      name: "Brand 4",
    },
    {
      image: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-5.svg",
      lightimg: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-light-5.svg",
      name: "Brand 5",
    },
  ];

function HeroSection({
  avatarList
}) {
  return (
    <section>
      <div className="w-full h-full relative pt-60">
        <div
          /* degrade 
          before:bg-linear-to-r 
            before:from-sky-100 
            before:via-white before:to-amber-100 
            before:rounded-full 
            before:top-24 
            before:blur-3xl 
            before:-z-10 
            dark:before:from-slate-800 
            dark:before:via-black 
            dark:before:to-stone-700 
            dark:before:rounded-full 
            dark:before:blur-3xl 
            dark:before:-z-10 */
          className="relative pt-0 md:pt-20 pb-6 md:pb-10 
          before:absolute 
          before:w-full 
          before:h-full
          w-1/2
          ">
          <div className="container mx-auto relative z-10">
            <div className="flex flex-col max-w-5xl mx-auto gap-8">
              <div
                className="relative flex flex-col text-center items-center sm:gap-6 gap-4">
                <motion.h1
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className="lg:text-9xl md:text-7xl text-5xl font-medium leading-20 md:leading-15 lg:leading-20">
                  <span className={`${instrumentSerif.className} tracking-tight block text-primary`}>
                    Produtividade
                  </span>
                  <span className="lg:text-7xl md:text-5xl text-4xl font-semibold">sem pausa</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.1, ease: "easeInOut" }}
                  className="text-lg font-semibold max-w-5xl text-muted-foreground">
                  Sua fábrica sincronizada em tempo real e sob controle.
                </motion.p>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: "easeInOut" }}
                className="flex items-center flex-col md:flex-row justify-center gap-8">
                <Button
                  className="relative text-lg font-medium rounded-full h-12 p-1 ps-6 pe-14 group transition-all duration-500 hover:ps-14 hover:pe-6 w-fit overflow-hidden cursor-pointer">
                  <span className="relative z-10 transition-all duration-500">
                    Cadastre-se
                  </span>
                  <span
                    className="absolute right-1 w-10 h-10 bg-background text-foreground rounded-full flex items-center justify-center transition-all duration-500 group-hover:right-[calc(100%-44px)] group-hover:rotate-45">
                    <ArrowUpRight size={16} />
                  </span>
                </Button>
              </motion.div>

              <div className="relative flex flex-col text-center items-center w-full">
                <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: "easeInOut" }}
                className="relative flex items-center justify-center w-full before:content-[''] before:absolute before:w-full before:h-px before:bg-gray-300">

                  <p className="relative z-10 bg-white px-4 text-base font-semibold text-cinza-escuro">
                    Utilizado por mais de 100 grandes empresas ao redor do mundo
                  </p>
                </motion.div>
              </div>

              <div className="relative flex flex-col text-center items-center w-full">
                <BrandSlider brandList={brandList} />
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

export default HeroSection;

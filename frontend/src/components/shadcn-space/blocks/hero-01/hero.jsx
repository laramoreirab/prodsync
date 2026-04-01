"use client";;
import { Instrument_Serif } from "next/font/google";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Marquee } from "@/components/shadcn-space/animations/marquee";
import LoginForm from "@/components/ui/formLogin";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
});

const virtual = 2; /* fazer dowloand da fonte correta */

const brandList = [
  {
    image: "https://reparaassistenciatecnica.com.br/wp-content/uploads/2021/11/bosch-logo-png-transparent.png",
    lightimg: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-light-1.svg",
    name: "Bosch",
  },
  {
    image: "https://images.tcdn.com.br/img/img_prod/673340/12516cp_lampada_painel_12v_1_2w_standard_convencional_philips_117609_2_9c7ea389b96258aba34fcc24cdf7aeb7.png",
    lightimg: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-light-2.svg",
    name: "Brand 2",
  },
  {
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhmtGah-kRzZoGIhuGdltJJjVhvSF5t202T7MXPh8QEscij-691H4xV0X8wTx0pJ5lSlW0Uyq5QeNdXqCnpt1dcWfORoc0Bq41Ovj4YG4hcL_fUKf_xIZiKGhsZ8GGVW91AxYoyyA/s1600/cofap+logo.jpg",
    lightimg: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-light-3.svg",
    name: "Brand 3",
  }
];

function HeroSection() {
  return (
    <section>
      <div className="w-full lg:h-[calc(100vh-80px)] md:h-full relative flex flex-col lg:flex-row items-center overflow-hidden">
        <div
          className="relative pt-10 lg:pt-20 pb-6 lg:pb-10 
          h-auto
          w-full lg:w-1/2 
          flex
          items-center
          ">
          <div className="container mx-auto relative z-10 lg:ml-20 lg:mx-0">
            <div className="flex flex-col max-w-5xl mx-auto lg:mx-0 gap-8">
              <div
                className="relative flex flex-col text-center items-center sm:gap-6 gap-4">
                <motion.h1
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className="lg:text-9xl md:text-8xl text-6xl font-medium leading-15 md:leading-15 lg:leading-20">
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
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2, ease: "easeInOut" }}
                  className="flex flex-col gap-3">
                  <div className="flex justify-center text-center py-3 md:py-4 relative">
                    <div className="flex items-center justify-center gap-4">
                      <div
                        className="hidden md:block h-0.5 w-40 bg-cinza-escuro opacity-20" />
                      <p className="relative z-10 bg-white px-4 text-base font-semibold text-cinza-escuro tracking-tight">
                        Utilizado por mais de 100 grandes
                        <br />
                        empresas ao redor do mundo
                      </p>
                      <div
                        className="hidden md:block h-0.5 w-40 bg-cinza-escuro opacity-20" />
                    </div>
                  </div>
                </motion.div>
              </div>

              <section>
                <div className=" mb-0">
                  <div className="mx-auto max-w-165">
                  <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeInOut" }}
                    className="flex flex-col gap-3">
                    {brandList && brandList.length > 0 && (
                      <div className="py-2">
                        <Marquee pauseOnHover className="[--duration:20s] p-0">
                          {brandList.map((brand, index) => (
                            <div key={index}>
                              <img
                                src={brand.image}
                                alt={brand.name}
                                className="w-36 h-8 mr-6 lg:mr-20 dark:hidden" />
                              <img
                                src={brand.lightimg}
                                alt={brand.name}
                                className="hidden dark:block w-36 h-8 mr-12 lg:mr-20" />
                            </div>
                          ))}
                        </Marquee>
                      </div>
                    )}
                  </motion.div>
                </div>
                </div>
              </section>

            </div>

          </div>
        </div>

        <section className="py-8 sm:py-16 lg:py-20 w-full lg:w-1/2 relative flex justify-center items-center">
          <div className="flex justify-center w-full px-4 lg:p-0 lg:mr-20">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2, ease: "easeInOut" }} >
              <LoginForm />
            </motion.div>
          </div>
        </section>

      </div>
    </section>
  );
}

export default HeroSection;

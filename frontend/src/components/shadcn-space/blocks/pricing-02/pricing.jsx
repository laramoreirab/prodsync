"use client";;
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Check, Flame } from "lucide-react";
import { motion } from "motion/react";

const pricingData = [
  {
    plan_name: "Operador",
    plan_descp:
      "Produza com clareza, registre com confiança.",
    plan_feature: [
      "Acompanhar metas de produção em tempo real",
      "Registra quantidade produzida por turno",
      "Relate motivos de paradas de máquina",
      "Visualize status das máquinas",
      "Contribua para indicadores de produtividade confiáveis",
    ],
    plan_recommended: false,
  },
  {
    plan_name: "Administrador",
    plan_descp:
      "Visão completa da empresa em um só lugar.",
    plan_feature: [
      "Dashboard geral da empresa",
      "Relatórios completos de produção e máquinas",
      "Cadastros de usuários, máquinas e setores",
      "Histórico de eventos de toda a fábrica",
      "Visão ampla e integrada de todos os setores",
    ],
    plan_recommended: true,
  },
  {
    plan_name: "Gestor",
    plan_descp:
      "Decisões rápidas com dados reais.",
    plan_feature: [
      "Dashboard dos setores que gerencia",
      "Relatórios de produção e desempenho das máquinas",
      "Cadastro de usuários e máquinas do setor",
      "Histórico de eventos por máquina",
      "Monitorar produtividade dos operadores",
    ],
    plan_recommended: false,
  },
];

const Pricing = () => {
  const pricingCardVariants = {
    hidden: {
      opacity: 0,
      x: -60,
    },
    visible: (index) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: index * 0.25,
        duration: 0.6,
        ease: "easeInOut",
      },
    }),
  };

  return (
    <section className="bg-background py-10 lg:py-0">
      
      <div className="w-full mx-auto text-center">
        <h2 className="text-4xl sm:text-5xl font-bold text-primary">
          Descubra como cada papel transforma sua gestão
        </h2>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 xl:px-16 lg:pb-20 sm:pb-16 py-8">
        <div
          className="flex flex-col gap-8 md:gap-12 items-center justify-center w-full">
          {/* Heading */}
          <div className="flex flex-col gap-4 justify-center items-center">

           <h2
              className="text-2xl sm:text-2x1 lg:text-3xl text-primary text-center tracking-tight font-semibold">
              Funções sob medida para cada perfil, cada usuário com as ferramentas
              certas para garantir o controle da produção de sua empresa
            </h2>

          </div>
          {/*  */}
          <div className="flex flex-col lg:flex-row gap-6 items-stretch h-full w-full">
            {pricingData.map((plan, index) => {
              const isFeatured = plan.plan_recommended;

              return (
                <motion.div
                  key={index}
                  variants={pricingCardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={index}
                  className={cn("relative flex-1 flex flex-col w-full", isFeatured && "z-10 scale-102")}>
                  {/* GRADIENT BORDER */}
                  {isFeatured && (
                    <div className="absolute -inset-0.5 rounded-2xl overflow-hidden">
                      {/* Animated conic-gradient border */}
                      <div
                        className="absolute -inset-full blur-xs animate-spin [animation-duration:2s] bg-conic from-blue-500 via-red-500 to-teal-400" />

                      {/* Inner mask */}
                      <div className="absolute inset-0.5 rounded-2xl bg-card" />
                    </div>
                  )}
                  {/* CARD */}
                  <Card
                    className={cn(
                      "relative flex-1 flex flex-col rounded-2xl p-8 gap-8",
                      isFeatured ? "border-0 ring-0" : "border border-border"
                    )}>
                    <CardHeader className="p-0">
                      <div className="flex flex-col gap-3 self-stretch">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-2xl font-medium text-primary">
                            {plan.plan_name}
                          </CardTitle>
                        </div>
                        <CardDescription className="text-base font-normal max-w-2x">
                          {plan.plan_descp}
                        </CardDescription>
                      </div>
                    </CardHeader>

                    <CardContent className="flex flex-col flex-1 gap-8 p-0">

                      <Separator orientation="horizontal" />

                      <ul className="flex flex-col gap-4 flex-1">
                        {plan.plan_feature.map((feature, idx) => (
                          <li
                            key={idx}
                            className="flex items-center gap-3 text-base font-normal text-muted-foreground">
                            <Check className="size-4 text-primary shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <Button
                        className="w-full h-12 cursor-pointer"
                        variant={isFeatured ? "default" : "outline"}>
                        Comece já
                      </Button>

                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;

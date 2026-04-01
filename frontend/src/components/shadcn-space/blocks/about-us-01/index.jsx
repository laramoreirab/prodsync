"use client";
import AboutUs from "@/components/shadcn-space/blocks/about-us-01/about-us";
import { Target, Sparkles, ChartNoAxesCombined } from "lucide-react";

const aboutusData = [
    {
      icon: ChartNoAxesCombined,
      title: "Produtividade",
      color: "bg-blue-500/10 text-blue-500"
    },
    {
      icon: Target,
      title: "Foco",
      color: "bg-green-400/10 text-green-400" 
    },
    {
      icon: Sparkles,
      title: "Inovação",
      color: "bg-red-400/10 text-red-400" 
    }
];

const statisticsCounter = [
    {
        title: "Empresas satisfeitas",
        count: 200
    },
    {
        title: "Anos de experiência",
        count: 10
    },
    {
        title: "Prêmios",
        count: 30
    },
]

const AboutAndStats01 = () => {
  return (
    <>
      <AboutUs aboutusData={aboutusData} statisticsCounter={statisticsCounter} />
    </>
  );
};

export default AboutAndStats01;

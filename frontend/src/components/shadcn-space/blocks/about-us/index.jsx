"use client";
import AboutUs from "@/components/shadcn-space/blocks/about-us/about-us";
import { Aperture, Laptop, ChartNoAxesCombined } from "lucide-react";

const aboutusData = [
    {
      icon: ChartNoAxesCombined,
      title: "Produtividade",
      color: "bg-[#e8eef7] text-[#00357a] border-[#00357a] "
    },
    {
      icon: Aperture,
      title: "Foco",
      color: "bg-secondary text-white" 
    },
    {
      icon: Laptop,
      title: "Inovação",
      color: "bg-primary text-white" 
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

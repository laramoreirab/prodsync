"use client";
import AboutUs from "@/components/shadcn-space/blocks/about-us/about-us";
import { Lightbulb, Goal,ChartNoAxesCombined } from "lucide-react";

const aboutusData = [
  {
    icon: ChartNoAxesCombined,
    title: "Produtividade",
    color: "bg-[#eef2f8] text-[#00357a]",
    iconBg: "bg-[#23304c]/10 text-[#00357a]",
  },
  {
    icon: Goal,
    title: "Foco",
    color: "bg-[#e8ecf4] text-[#00357a]",
    iconBg: "bg-[#23304c]/10 text-[#00357a]",
  },
  {
    icon: Lightbulb,
    title: "Inovação",
    color: "bg-[#e4eaf4] text-[#00357a]",
    iconBg: "bg-[#23304c]/10 text-[#00357a]",
  },
];

const statisticsCounter = [
  {
    title: "Empresas satisfeitas",
    count: 200,
  },
  {
    title: "Anos de experiência",
    count: 10,
  },
  {
    title: "Prêmios",
    count: 30,
  },
];

const AboutAndStats01 = () => {
  return (
    <AboutUs aboutusData={aboutusData} statisticsCounter={statisticsCounter} />
  );
};

export default AboutAndStats01;

"use client";
import AboutUs from "@/components/shadcn-space/blocks/about-us/about-us";
import { Gauge, Target, Cpu } from "lucide-react";

const aboutusData = [
  {
    icon: Gauge,
    title: "Produtividade",
    color: "bg-[#eef2f8] text-[#23304c] border-[#23304c]/12",
    iconBg: "bg-[#23304c]/10 text-[#23304c]",
  },
  {
    icon: Target,
    title: "Foco",
    color: "bg-[#e8ecf4] text-[#23304c] border-[#23304c]/15",
    iconBg: "bg-[#23304c]/12 text-[#23304c]",
  },
  {
    icon: Cpu,
    title: "Inovação",
    color: "bg-[#e4eaf4] text-[#00357a] border-[#00357a]/15",
    iconBg: "bg-[#00357a]/10 text-[#00357a]",
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

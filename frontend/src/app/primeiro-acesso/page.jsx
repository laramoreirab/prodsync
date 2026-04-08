import { Card } from "@/components/ui/card";
import Header from "@/components/ui/headerHome";

export default function Home() {

  const navigationData = [
    {
      title: "Home",
      href: "/",
      isActive: true,
    },
    {
      title: "Sobre nós",
      href: "#about-us",
    },
    {
      title: "Serviços",
      href: "#servicos",
    },    
    {
      title: "FAQs",
      href: "#faqs",
    }
  ];

  return (
    <>
    <Header navigationData={navigationData} />
    
    </>
  );
}

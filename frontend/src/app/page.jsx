import AgencyHeroSection from "@/components/shadcn-space/blocks/hero-01";
import AboutAndStats01 from "@/components/shadcn-space/blocks/about-us-01";
import Pricing from "@/components/shadcn-space/blocks/pricing-02/pricing";
import Testimonial01 from "@/components/shadcn-space/blocks/testimonial-02";
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
      href: "#",
    },
    {
      title: "Serviços",
      href: "#",
    },    
    {
      title: "FAQs",
      href: "#",
    }
  ];

  return (
    <>
    <Header navigationData={navigationData} />
      <AgencyHeroSection />
      <AboutAndStats01 />
      <Pricing />
      <Testimonial01 />
    </>
  );
}

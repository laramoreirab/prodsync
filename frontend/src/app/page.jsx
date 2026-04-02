import AgencyHeroSection from "@/components/shadcn-space/blocks/hero";
import AboutAndStats01 from "@/components/shadcn-space/blocks/about-us";
import Pricing from "@/components/shadcn-space/blocks/pricing-02/pricing";
import Testimonial01 from "@/components/shadcn-space/blocks/testimonial-02";
import Header from "@/components/ui/headerHome";
import Footer from "@/components/shadcn-space/blocks/footer/footer";
import Faq from "@/components/shadcn-space/blocks/faq/faq";

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
      <Faq />
      <Footer />
    </>
  );
}

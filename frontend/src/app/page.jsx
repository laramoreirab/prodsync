import AgencyHeroSection from "@/components/shadcn-space/blocks/hero";
import AboutAndStats01 from "@/components/shadcn-space/blocks/about-us";
import Pricing from "@/components/shadcn-space/blocks/pricing/pricing";
import Testimonial01 from "@/components/shadcn-space/blocks/testimonial";
import Header from "@/components/ui/headerHome";
import Footer from "@/components/shadcn-space/blocks/footer/footer";
import Faq from "@/components/shadcn-space/blocks/faq/faq";
import HomeAuthRedirect from "@/components/auth/HomeAuthRedirect";
import { HomeMeshBackground } from "@/components/landing/HomeMeshBackground";

export default function Home() {
  const navigationData = [
    {
      title: "Home",
      href: "/",
      isActive: true,
    },
    {
      title: "Sobre nós",
      href: "#sobre-nos",
    },
    {
      title: "Serviços",
      href: "#servicos",
    },
    {
      title: "FAQs",
      href: "#faqs",
    },
  ];

  return (
    <>
      <HomeAuthRedirect />

      <div className="home-plexus-region relative min-h-[100svh] bg-white">
        <HomeMeshBackground />
        <div className="relative z-10">
          <Header navigationData={navigationData} />
          <AgencyHeroSection />
        </div>
      </div>

      <AboutAndStats01 />
      <Pricing />
      <Testimonial01 />
      <Faq />
      <Footer />
    </>
  );
}

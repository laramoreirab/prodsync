import AgencyHeroSection from "@/components/shadcn-space/blocks/hero-01";
import AboutAndStats01 from "@/components/shadcn-space/blocks/about-us-01";
import Pricing from "@/components/shadcn-space/blocks/pricing-02/pricing";

export default function Home() {
  return (
    <>
      <AgencyHeroSection />
      <AboutAndStats01 />
      <Pricing />
      {/* <section className="w-full bg-blue-300 h-auto">
        <div className="bg-red-600">
          <h2 className="text-primary lg:text-3xl md:text-2xl font-bold font-sans text-center lg:px-100">
            Elabore estratégias excepcionais, baseadas em experiência e
            tecnologia, para gerar resultados impactantes para sua
            fábrica com
          </h2>
        </div>
        <div className="bg-pink-400 mt-3 h-20 flex-col">
        </div>
      </section> */}
    </>
  );
}

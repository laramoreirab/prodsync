"use client";;
import { Marquee } from "@/components/shadcn-space/animations/marquee";
import { motion } from "motion/react";

const brandList = [
  {
    image: "https://reparaassistenciatecnica.com.br/wp-content/uploads/2021/11/bosch-logo-png-transparent.png",
    lightimg: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-light-1.svg",
    name: "Bosch",
  },
  {
    image: "https://images.tcdn.com.br/img/img_prod/673340/12516cp_lampada_painel_12v_1_2w_standard_convencional_philips_117609_2_9c7ea389b96258aba34fcc24cdf7aeb7.png",
    lightimg: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-light-2.svg",
    name: "Brand 2",
  },
  {
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhmtGah-kRzZoGIhuGdltJJjVhvSF5t202T7MXPh8QEscij-691H4xV0X8wTx0pJ5lSlW0Uyq5QeNdXqCnpt1dcWfORoc0Bq41Ovj4YG4hcL_fUKf_xIZiKGhsZ8GGVW91AxYoyyA/s1600/cofap+logo.jpg",
    lightimg: "https://images.shadcnspace.com/assets/brand-logo/logoipsum-light-3.svg",
    name: "Brand 3",
  }
];

function BrandSlider({
    brandList
}) {
    return (
        <section>
            <div className="py-6 md:py-10 mb-0">
                <div className="mx-auto max-w-165">
                    <motion.div
                        initial={{ opacity: 0, y: 32 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2, ease: "easeInOut" }}
                        className="flex flex-col gap-3">
                        {brandList && brandList.length > 0 && (
                            <div className="py-4">
                                <Marquee pauseOnHover className="[--duration:20s] p-0">
                                    {brandList.map((brand, index) => (
                                        <div key={index}>
                                            <img
                                                src={brand.image}
                                                alt={brand.name}
                                                className="w-36 h-8 mr-6 lg:mr-20 dark:hidden" />
                                            <img
                                                src={brand.lightimg}
                                                alt={brand.name}
                                                className="hidden dark:block w-36 h-8 mr-12 lg:mr-20" />
                                        </div>
                                    ))}
                                </Marquee>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

export default BrandSlider;
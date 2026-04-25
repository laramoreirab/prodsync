"use client";;
import { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { motion, useInView } from "motion/react";

export default function Testimonial01({
    testimonials = defaultTestimonials
}) {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

    return (
        <section ref={sectionRef}>
            <div className="max-w-7xl mx-auto sm:px-16 px-4 pt-12">
                <div className="">
                    <motion.div
                        initial={{ opacity: 0, y: -40 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -40 }}
                        transition={{ duration: 1, delay: 0.2, ease: "easeInOut" }}
                        className="flex flex-col gap-3">
                        <Badge className="text-sm bg-secondary-foreground h-auto py-1 px-3 border-0 w-fit">
                            Depoimentos
                        </Badge>
                        <div className="flex flex-col md:flex-row gap-3">
                            <h2 className="sm:text-5xl text-xl leading-none font-medium tracking-tight">
                                Histórias de Sucesso com
                            </h2>
                            <img
                                src="/logo.png"
                                alt="Logo da Empresa"
                                className="w-48 shrink-0 object-contain"
                            />
                        </div>


                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                        transition={{ duration: 1, delay: 0.2, ease: "easeInOut" }}
                        className="pt-12 pb-8">
                        <Carousel>
                            <CarouselContent>
                                {testimonials.map((testimonial, index) => (
                                    <CarouselItem key={index}>
                                        <div className="grid grid-cols-12 gap-6 items-center">
                                            <div
                                                className="lg:col-span-8 col-span-12 flex sm:flex-row flex-col sm:gap-10 gap-6 lg:pe-12">
                                                <div className="shrink-0 flex items-start">
                                                    <img
                                                        src="/quote.svg"
                                                        alt="muted quote"
                                                        className="w-15"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-12">
                                                    <p className="sm:text-3xl text-xl">
                                                        {testimonial.quote}
                                                    </p>
                                                    <div>
                                                        <p className="text-lg font-semibold">
                                                            {testimonial.author}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {testimonial.role}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="md:col-span-4 col-span-12">
                                                <div className="rounded-xl overflow-hidden">
                                                    <img
                                                        src={testimonial.image}
                                                        alt={testimonial.author}
                                                        width={500}
                                                        height={500}
                                                        className="w-full h-full object-cover" />
                                                </div>
                                            </div>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className={"-top-20 left-auto right-12 size-8 cursor-pointer"} />
                            <CarouselNext className={"-top-20 right-0 size-8 cursor-pointer"} />
                        </Carousel>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

"use client";;
import { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import Logo from "@/assets/logo/logo";
import { motion, useInView } from "motion/react";

/* const defaultTestimonials = [
    {
        quote: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
        author: "Nome diferente",
        role: "CEO",
        image: "https://images.shadcnspace.com/assets/profiles/testimonial-user.png",
    },
    {
        quote: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ",
        author: "Outro Nome",
        role: "CEO",
        image: "https://images.shadcnspace.com/assets/profiles/testimonial-user-2.png",
    },
];
 */
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
                        <Badge className="text-sm h-auto py-1 px-3 border-0 w-fit">
                            Depoimentos
                        </Badge>
                        <h2 className="sm:text-5xl text-xl leading-none font-medium tracking">
                            Histórias de Sucesso com {/* <img src="/logo.png" /> */}
                        </h2>

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
                                                        src="/quote.png"
                                                        alt="muted quote"
                                                        className="opacity-20 w-15"
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

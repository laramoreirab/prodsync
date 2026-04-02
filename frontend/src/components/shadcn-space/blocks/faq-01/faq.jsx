import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQ_DATA = [
  {
    question: "Como o sistema sabe quando a máquina está parada?",
    answer:
      "We offer a wide range of services including web development, app development, and digital marketing.",
  },
  {
    question: "Preciso estar no computador para usar o sistema?",
    answer:
      "Não, o sistema pode ser acessado tanto via site quanto pelo nosso aplicativo.",
  },
  {
    question: "O que acontece se o operador esquecer de registrar a produção?",
    answer:
      "Pricing is based on the complexity of the project and the scope of the work.",
  },
  {
    question: "Como esses dados ajudam a melhorar a produção?",
    answer:
      "Absolutely! We offer comprehensive post-launch support to ensure a seamless implementation and provide ongoing maintenance packages tailored to clients who need regular updates or technical assistance. Our commitment doesn’t end at launch — we’re here to help you every step of the way.",
  },
  {
    question: "Como posso tirar minhas dúvidas sobre o sistema?",
    answer:
      "E-mail: prodsync@gmail.com Telefone: 4004-8922",
  },
];

export default function Faq() {
  return (
    <section>
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:py-24 py-8 flex flex-col gap-16">
        <div
          className="flex flex-col gap-4 items-center animate-in fade-in slide-in-from-top-10 duration-1000 delay-100 ease-in-out fill-mode-both">
          <Badge
            variant="outline"
            className="text-sm h-auto py-1 px-3 border-0 outline outline-border bg-secondary-foreground text-white font-medium font-sans">
            FAQs
          </Badge>
          <h2 className="text-5xl font-bold text-center text-primary">
            Tem dúvidas? Nós estamos prontos para respondê-las!
          </h2>
        </div>
        <div>
          <Accordion className="w-full flex flex-col gap-6">
            {FAQ_DATA.map((faq, index) => (
              <AccordionItem
                key={`item-${index}`}
                value={`item-${index}`}
                className={cn(
                  "p-6 border border-border font-medium rounded-2xl flex flex-col gap-3 group/item data-[open]:bg-accent transition-colors animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both",
                  index === 0 && "delay-100",
                  index === 1 && "delay-200",
                  index === 2 && "delay-300",
                  index === 3 && "delay-400",
                  index === 4 && "delay-500"
                )}>
                <AccordionTrigger
                  className="p-0 text-xl font-medium hover:no-underline **:data-[slot=accordion-trigger-icon]:hidden cursor-pointer">
                  {faq.question}
                  <PlusIcon
                    className="w-6 h-6 shrink-0 transition-transform duration-200 group-aria-expanded/accordion-trigger:rotate-45" />
                </AccordionTrigger>
                <AccordionContent className="p-0 text-muted-foreground text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

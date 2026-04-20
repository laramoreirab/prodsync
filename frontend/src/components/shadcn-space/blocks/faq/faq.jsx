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
      "",
  },
  {
    question: "Preciso estar no computador para usar o sistema?",
    answer:
      "Não, o sistema pode ser acessado tanto via site quanto pelo nosso aplicativo.",
  },
  {
    question: "O que acontece se o operador esquecer de registrar a produção?",
    answer:
      "",
  },
  {
    question: "Como esses dados ajudam a melhorar a produção?",
      answer: (
      <div className="flex flex-col ">
        <p>
          Com informações confiáveis e em tempo real, a empresa consegue:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Identificar gargalos e causas de paradas</li>
          <li>Comparar turnos e operadores com indicadores claros</li>
          <li>Tomar decisões baseadas em dados, não em achismos</li>
          <li>Aumentar produtividade e reduzir desperdícios</li>
        </ul>
      </div>
    ),
  },
  {
    question: "Como posso tirar minhas dúvidas sobre o sistema?",
    answer:
      "E-mail: prodsync@gmail.com Telefone: 4004-8922",
  },
];

export default function Faq() {
  return (
    <section id="faqs">
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:py-24 py-8 flex flex-col gap-16">
        <div
          className="flex flex-col gap-4 items-center animate-in fade-in slide-in-from-top-10 duration-1000 delay-100 ease-in-out fill-mode-both">
          <Badge
            variant="outline"
            className="text-sm h-auto py-1 px-3 border-0 outline outline-border bg-secondary-foreground text-white font-medium font-sans">
            FAQs
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold text-center text-primary">
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
                  "p-6 border border-border font-medium rounded-2xl flex flex-col gap-3 group/item data-open:bg-accent transition-colors animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both",
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

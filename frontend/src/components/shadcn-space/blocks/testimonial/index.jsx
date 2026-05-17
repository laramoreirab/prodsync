import Testimonial01Inner from "@/components/shadcn-space/blocks/testimonial/testimonial";

const defaultTestimonials = [
    {
        quote: "Rastreabilidade e confiabilidade são as palavras-chave. Ao automatizar o registro de status e exigir o motivo da parada via software, o sistema remove a subjetividade e o erro humano do processo de apontamento. É uma solução de baixo custo com impacto direto na margem de lucro da empresa.",
        author: "Errica Mcdowell",
        role: "Diretora Industrial – GrupoPack",
        image: "https://images.shadcnspace.com/assets/profiles/testimonial-user-2.png",
    },
    {
        quote: "A integração foi rápida e o suporte sempre presente. Em menos de duas semanas já tínhamos dados confiáveis de OEE por máquina. Hoje tomamos decisões baseadas em números, não em achismos.",
        author: "Fernanda Lopes",
        role: "CEO – Indústria Textil Nobre",
        image: "https://images.shadcnspace.com/assets/profiles/testimonial-user.png",
    },
];

export default function Testimonial01() {
    return (
        <main>
            <Testimonial01Inner testimonials={defaultTestimonials} />
        </main>
    );
}
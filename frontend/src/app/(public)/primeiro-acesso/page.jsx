export const metadata = {
  title: "Primeiro acesso",
  description:
    "Configure sua primeira senha e acesse sua conta ProdSync com segurança.",
  alternates: {
    canonical: "/primeiro-acesso",
  },
};
import CriarSenha from "@/components/ui/cardCriarSenha";
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
      href: "/#sobre-nos",
    },
    {
      title: "Serviços",
      href: "/#servicos",
    },    
    {
      title: "FAQs",
      href: "/#faqs",
    }
  ];

  return (
    <>
    <Header navigationData={navigationData} />
      <main id="conteudo-principal">
        <CriarSenha />
      </main>
    </>
  );
}

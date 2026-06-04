import RegisterForm from "@/components/ui/formCadastro";
import LeftCards from "@/components/ui/leftCadastro";
import Header from "@/components/ui/headerHome";

export default function RegisterPage() {

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
    {/* Mantém o grid com 55% para a esquerda e 45% para a direita */}
    <main className="min-h-[calc(100vh-80px)] grid grid-cols-1 md:grid-cols-[55%_45%] bg-gray-100 overflow-hidden">

      {/* COLUNA DA ESQUERDA: Conteúdo alinhado à direita (levemente após o meio da tela) */}
      <div className="hidden md:flex items-center justify-end pr-4 lg:pr-8 relative">
        <LeftCards />
      </div>

      {/* COLUNA DA DIREITA: Conteúdo alinhado no início (start) */}
      <div className="flex items-center justify-start pl-4 lg:pl-10 p-8">
        <div className="w-full max-w-md">
          <RegisterForm />
        </div>
      </div>
      
    </main>
  </>
);
}

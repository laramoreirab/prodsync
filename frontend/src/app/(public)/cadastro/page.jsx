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
      href: "#about-us",
    },
    {
      title: "Serviços",
      href: "#servicos",
    },
    {
      title: "FAQs",
      href: "#faqs",
    }
  ];

  return (
    <>
      <Header navigationData={navigationData} />
      <main className="min-h-[calc(100vh-80px)] grid grid-cols-1 md:grid-cols-2 bg-gray-100 overflow-hidden">
  
        {/* COLUNA ESQUERDA: Alinha o conteúdo para a DIREITA (fim da div) */}
        <div className="hidden md:flex items-center justify-end pr-6 lg:pr-10 relative">
          <LeftCards />
        </div>
  
        {/* COLUNA DIREITA: Alinha o conteúdo para a ESQUERDA (início da div) */}
        <div className="flex items-center justify-start pl-4 lg:pl-10 p-8">
          <div className="w-full max-w-md">
            <RegisterForm />
          </div>
        </div>
        
      </main>
    </>
  );
}

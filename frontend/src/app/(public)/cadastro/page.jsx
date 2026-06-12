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
    },
  ];

  return (
    <>
      <Header navigationData={navigationData} />
      <main className="h-[calc(100vh-80px)] min-h-0 grid grid-cols-1 md:grid-cols-[55%_45%] bg-gray-100 overflow-hidden">
        <div className="hidden min-h-0 md:flex items-center justify-end pr-4 lg:pr-8 relative overflow-hidden">
          <LeftCards />
        </div>

        <div className="flex min-h-0 items-center justify-start pl-4 lg:pl-10 p-8 overflow-hidden">
          <div className="w-full max-w-md">
            <RegisterForm />
          </div>
        </div>
      </main>
    </>
  );
}

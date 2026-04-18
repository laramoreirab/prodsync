import Header from "@/components/ui/topbar";
import { SetoresListaWidget } from "@/features/setores/SetoresListaWidget";

export default function UnifiedDashboardPage() {
  return (
    <main
      className="relative min-h-screen w-full flex flex-col items-center overflow-x-hidden"
      style={{
        backgroundImage: "url('/bg_app.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-full">
        <Header />
      </div>

      <div className="w-full max-w-6xl mt-[-800px] pt-0 pb-10 px-4 space-y-4">
        <div className="flex justify-start mb-6">
          <h1 className="text-4xl font-semibold text-black border-b-4 border-[var(--secondary-foreground)] pb-0 inline-block">
            Setores
          </h1>
        </div>

        {/* Aqui entra a integração do componente de Setores */}
        <div className="bg-[#f8f8f8] py-10 px-4 rounded-lg">
          <SetoresListaWidget />
        </div>
      </div>
    </main>
  );
}
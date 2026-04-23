import Header from "@/components/ui/topbar";

export default function ProducaoOperadorPage() {
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

      <div className="w-80% max-w-5xl mt-8 pb-10 px-4 space-y-4">

        {/* TÍTULO */}
        <div className="flex justify-start">
          <h1 className="text-4xl font-semibold text-black pb-0 inline-block">
            Maquina Especifica
          </h1>
        </div>


      </div>
    </main>
  );
}
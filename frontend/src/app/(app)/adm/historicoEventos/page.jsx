import { ParadasComparadasWidget } from "@/features/eventos/ParadasComparadasWidget";
import { TopMotivosTempoWidget } from "@/features/eventos/TopMotivosTempoWidget";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from 'lucide-react';

export default function PageLayout() {
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

      <div className="w-full max-w-6xl mt-8 pt-0 pb-10 px-4 space-y-4">
        {/* TÍTULO E BOTÃO */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex justify-start">
            <h1 className="underline decoration-secondary-foreground underline-offset-9 decoration-5 text-4xl font-semibold">
              Histórico de Eventos
            </h1>
          </div>

          {/* Modal de Registro de Evento */}
          <div className="modal_cadastro">
            <Dialog>
              <DialogTrigger className="bg-secondary-foreground px-4 py-1 rounded-md flex items-center text-white text-xl font-semibold">
                <Plus className="mr-2" />
                Registrar Evento
              </DialogTrigger>
              <DialogContent>
                <h1>registrando evento</h1>
              </DialogContent>
              
            </Dialog>
          </div>
        </div>

        {/* SEÇÃO DOS GRÁFICOS  */}
        <section className=" p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Widget 1/3 */}
            <div className="bg-white border rounded-xl p-4 md:col-span-1">
              <ParadasComparadasWidget />
            </div>

            {/* Widget 2/3 */}
            <div className="bg-white border rounded-xl p-4 md:col-span-2">
              <TopMotivosTempoWidget />
            </div>

          </div>
        </section>
      </div>
    </main>
  );
}
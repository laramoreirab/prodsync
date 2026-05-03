import Header from "@/components/ui/topbar";
import { SetorMaquinaStatusWidget } from "@/features/setores/SetorMaquinaStatusWidget";
import { SetorOEEMedioWidget } from "@/features/setores/SetorOEEMedioWidget";
import { SetorOEEEvolucaoWidget } from "@/features/setores/SetorOEEEvolucaoWidget";
import { SetorTopOperadoresWidget } from "@/features/setores/SetorTopOperadoresWidget";
import { SetorMotivosParadaWidget } from "@/features/setores/SetorMotivosParadaWidget";
import { SetorProducaoSemanalWidget } from "@/features/setores/SetorProducaoSemanalWidget";

import TableListagens from "@/components/table";

const colunaUsuarioSetor = [
  { id: "nome", key: "nome", label: "Nome", className: "w-1/7" },
  { id: "id", key: "id", label: "ID", className: "w-1/5" },
  { id: "funcao", key: "funcao", label: "Função", className: "w-1/5" },
  { id: "turno", key: "turno", label: "Turno", className: "w-1/5" },
  {
    id: "oee_medio",
    key: "oee_medio",
    label: "OEE Médio",
    className: "w-45",
  }
];
const colunaMaquinaSetor = [
  { id: "nome", key: "nome", label: "Nome(ID)", className: "w-1/7" },
  { id: "oee_atual", key: "oee_atual", label: "OEE Atual", className: "w-45", },
  { id: "operador", key: "operador", label: "Operador", className: "w-1/5" },
  {
      id: 'status',
      key: 'status',
      label: 'Status',
      className: 'text-center justify-center',
      icone: (valor) => {
        const config = {
          "Produzindo": {
            variant: "outline",
            className: "bg-green-500/15 text-green-600 text-sm font-semibold border-none"
          },
          "Setup": {
            variant: "secondary",
            className: "bg-[#fffbea] text-amarelo font-semibold text-sm "
          },
          "Parada": {
            variant: "destructive",
            className: "font-semibold text-sm border-none"
          }
        };
  
        const estilo = config[valor] || { variant: "outline", className: "" };
        return (
          <Badge variant={estilo.variant} className={`whitespace-nowrap ${estilo.className}`}>
            {valor}
          </Badge>
        );
      }
    },
  { id: "ultima_parada", key: "ultima_parada", label: "Última Parada", className: "w-1/5" },
];

export default function SetorEspecificoPage({ params }) {
  const { id } = params;

  const dadosExibidos = [
    {
      setor: "roscas",
      gestor: "Luiz Mariz",
      oee_medio: "76%",
      qtd_de_maquinas: 67,
      qtd_de_operadores: 60,
    },
    {
      setor: "engrenagens",
      gestor: "Luiza Mariza",
      oee_medio: "78%",
      qtd_de_maquinas: 60,
      qtd_de_operadores: 58,
    },
    {
      setor: "brocas",
      gestor: "Estevão Ferreira",
      oee_medio: "77%",
      qtd_de_maquinas: 50,
      qtd_de_operadores: 34,
    },
    {
      setor: "brocas",
      gestor: "Estevão Ferreira",
      oee_medio: "77%",
      qtd_de_maquinas: 50,
      qtd_de_operadores: 34,
    },
    {
      setor: "brocas",
      gestor: "Estevão Ferreira",
      oee_medio: "77%",
      qtd_de_maquinas: 50,
      qtd_de_operadores: 34,
    },
    {
      setor: "brocas",
      gestor: "Estevão Ferreira",
      oee_medio: "77%",
      qtd_de_maquinas: 50,
      qtd_de_operadores: 34,
    },
    {
      setor: "brocas",
      gestor: "Estevão Ferreira",
      oee_medio: "77%",
      qtd_de_maquinas: 50,
      qtd_de_operadores: 34,
    },
    {
      setor: "brocas",
      gestor: "Estevão Ferreira",
      oee_medio: "77%",
      qtd_de_maquinas: 50,
      qtd_de_operadores: 34,
    },
    {
      setor: "brocas",
      gestor: "Estevão Ferreira",
      oee_medio: "77%",
      qtd_de_maquinas: 50,
      qtd_de_operadores: 34,
    },
    {
      setor: "brocas",
      gestor: "Estevão Ferreira",
      oee_medio: "77%",
      qtd_de_maquinas: 50,
      qtd_de_operadores: 34,
    },
    {
      setor: "brocas",
      gestor: "Estevão Ferreira",
      oee_medio: "77%",
      qtd_de_maquinas: 50,
      qtd_de_operadores: 34,
    },
  ];
  const dadosMaquina = [
  {
    nome: "Injetora 01",
    oee_atual: "88%",
    oee_medio: "82%",
    status: "Produzindo",
    ultima_parada: "Hoje, 08:15",
  },
  {
    nome: "Torno CNC A2",
    oee_atual: "0%",
    oee_medio: "75%",
    status: "Parada",
    ultima_parada: "Hoje, 10:30",
  },
  {
    nome: "Prensa Hidráulica",
    oee_atual: "92%",
    oee_medio: "89%",
    status: "Produzindo",
    ultima_parada: "Ontem, 22:00",
  },
  {
    nome: "Fresa Industrial",
    oee_atual: "45%",
    oee_medio: "70%",
    status: "Manutenção",
    ultima_parada: "Hoje, 07:00",
  },
  {
    nome: "Solda Robótica 05",
    oee_atual: "98%",
    oee_medio: "95%",
    status: "Produzindo",
    ultima_parada: "01/05, 14:20",
  },
  {
    nome: "Corte a Laser",
    oee_atual: "0%",
    oee_medio: "60%",
    status: "Setup",
    ultima_parada: "Hoje, 11:45",
  }
];

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

      <div className="w-full mt-8 pb-10 px-8 space-y-4">


        <div className="flex justify-start mb-6">
          <h1 className="text-4xl font-semibold text-black border-b-4 border-[var(--secondary-foreground)] pb-0 inline-block">
            Setor
          </h1>
        </div>


        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-white border rounded-xl p-6 shadow-sm">
            <SetorMaquinaStatusWidget setorId={id} />
          </div>
          <div className="md:col-span-1 bg-white border rounded-xl p-6 shadow-sm flex flex-col items-center justify-center">
            <SetorOEEMedioWidget setorId={id} />
          </div>
        </section>


        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-white border rounded-xl p-6 shadow-sm">
            <SetorProducaoSemanalWidget setorId={id} />
          </div>
          <div className="md:col-span-1 bg-white border rounded-xl p-6 shadow-sm">
            <SetorTopOperadoresWidget setorId={id} />
          </div>
        </section>


        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1 bg-white border rounded-xl p-6 shadow-sm">
            <SetorMotivosParadaWidget setorId={id} />
          </div>
          <div className="md:col-span-2 bg-white border rounded-xl p-6 shadow-sm">
            <SetorOEEEvolucaoWidget setorId={id} />
          </div>
        </section>

        <section>
          <h1>Inventário de Máquinas do Setor</h1>
          <div className="flex flex-col flex-1 items-center w-full mt-4 px-8">
            {dadosExibidos.length > 0 ? (
              /* dados só renderizam a tabela se tiver resultado */
              <TableListagens
                data={dadosMaquina}
                columns={colunaMaquinaSetor}
                acoesDropdown={(setor) => (
                  <>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href={`setores/${setor.setor}`}>
                        <EyeIcon className="mr-2 h-4 w-4" />
                        Ver Detalhes
                      </Link>
                    </DropdownMenuItem>

                    <Dialog>
                      <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                          <Pencil className="mr-2 h-4 w-4 text-primary" />
                          Editar
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <DialogContent>
                        <FormEdicaoSetor />
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                          <Trash2 className="mr-2 h-4 w-4 text-vermelho-vivido" />
                          Excluir
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <DialogContent>
                        <FormExclusaoSetor />
                      </DialogContent>
                    </Dialog>

                  </>
                )}
              />
            ) : (
              /* se não tiver correspondência (length === 0), mostra apenas a div */
              <div className="flex flex-col items-center justify-center p-8 text-gray-500 w-full mt-4">
                <Search className="w-12 h-12 mb-4 text-gray-300" />
                <h2 className="text-xl font-semibold">Nenhum setor encontrado</h2>
                {/* <p>Não encontramos nenhum resultado para "{busca}".</p> */}
              </div>
            )}
          </div>
          <h1>Listagem de Usuários do Setor</h1>
          <div className="flex flex-col flex-1 items-center w-full mt-4 px-8">
            {dadosExibidos.length > 0 ? (
              /* dados só renderizam a tabela se tiver resultado */
              <TableListagens
                data={dadosExibidos}
                columns={colunaUsuarioSetor}
                acoesDropdown={(setor) => (
                  <>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href={`setores/${setor.setor}`}>
                        <EyeIcon className="mr-2 h-4 w-4" />
                        Ver Detalhes
                      </Link>
                    </DropdownMenuItem>

                    <Dialog>
                      <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                          <Pencil className="mr-2 h-4 w-4 text-primary" />
                          Editar
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <DialogContent>
                        <FormEdicaoSetor />
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                          <Trash2 className="mr-2 h-4 w-4 text-vermelho-vivido" />
                          Excluir
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <DialogContent>
                        <FormExclusaoSetor />
                      </DialogContent>
                    </Dialog>

                  </>
                )}
              />
            ) : (
              /* se não tiver correspondência (length === 0), mostra apenas a div */
              <div className="flex flex-col items-center justify-center p-8 text-gray-500 w-full mt-4">
                <Search className="w-12 h-12 mb-4 text-gray-300" />
                <h2 className="text-xl font-semibold">Nenhum setor encontrado</h2>
                {/* <p>Não encontramos nenhum resultado para "{busca}".</p> */}
              </div>
            )}
          </div>
        </section>

      </div>
    </main>
  );
}
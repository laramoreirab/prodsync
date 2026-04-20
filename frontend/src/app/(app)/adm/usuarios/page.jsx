import Header from "@/components/ui/topbar";
import TableListagens from "@/components/shadcn-studio/table/table";
import SearchBar from "@/components/ui/searchBar";

//Widgets dashboard
import { QtdUsuariosWidget }          from "@/features/usuarios/QtdUsuariosWidget";
import { QtdUsuariosPorSetorWidget }  from "@/features/usuarios/QtdUsuariosPorSetorWidget";
import { TopOperadoresWidget }        from "@/features/usuarios/TopOperadoresWidget";
import { TempoSessaoWidget }          from "@/features/usuarios/TempoSessaoWidget";
import { RotatividadeWidget }         from "@/features/usuarios/RotatividadeWidget";
import { SobrecargaSetorWidget }      from "@/features/usuarios/SobrecargaSetorWidget";
import { ProducaoMediaSetorWidget }   from "@/features/usuarios/ProducaoMediaSetorWidget";
 

export default function Usuarios() {

  const colunasUsuarios = [
    { key: 'nome', label: 'Nome' },
    { key: 'id', label: 'ID', className: 'w-20' },
    { key: 'setor', label: 'Setor' },
    { key: 'funcao', label: 'Função' },
    { key: 'turno', label: 'Turno' },
  ];

  const dadosUsuarios = [
    { id: 1, nome: 'Ana Silva', setor: 'Montagem', funcao: 'tal funcao', turno: 'Manhã' },
    { id: 2, nome: 'Carlos Souza', setor: 'Qualidade', funcao: 'outra funcao', turno: 'Tarde' },
  ];

  return (
    <main className="min-h-screen bg-[url('/bg_app.svg')] bg-cover bg-center bg-no-repeat">
      <Header />
      {/* SEÇÃO 1: CHarts*/}
      <section className="bg-white rounded-2xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="border rounded-xl p-4">
            <QtdUsuariosWidget />
          </div>

          <div className="border rounded-xl p-4">
            <QtdUsuariosPorSetorWidget />
          </div>

          <div className="border rounded-xl p-4">
            <TopOperadoresWidget />
          </div>

        </div>
      </section>

      {/* SEÇÃO 2: Charts */}
      <section className="bg-white rounded-2xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="border rounded-xl p-6">
            <TempoSessaoWidget />
          </div>

          <div className="border rounded-xl p-4">
            <RotatividadeWidget />
          </div>

        </div>
      </section>

      {/* SEÇÃO 3: Charts */}
      <section className="bg-white rounded-2xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="border rounded-xl p-4">
            <SobrecargaSetorWidget />
          </div>

          <div className="border rounded-xl p-4">
            <ProducaoMediaSetorWidget />
          </div>

        </div>
      </section>


      <div className="flex flex-col flex-1 items-center">
        <SearchBar />
        <TableListagens data={dadosUsuarios} columns={colunasUsuarios} />
      </div>

    </main>
  );
}


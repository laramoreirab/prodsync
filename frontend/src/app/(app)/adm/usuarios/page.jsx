import Header from "@/components/ui/topbar";
import TableListagens from "@/components/shadcn-studio/table/table";
import SearchBar from "@/components/ui/searchBar";

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


      <div className="flex flex-col flex-1 items-center">
        <SearchBar />
        <TableListagens data={dadosUsuarios} columns={colunasUsuarios} />
      </div>

    </main>
  );
}


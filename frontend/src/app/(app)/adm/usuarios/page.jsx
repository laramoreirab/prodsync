import TableListagens from "@/components/shadcn-studio/table/table";
import SearchBar from "@/components/ui/searchBar";

export default function Usuarios() {
  const colunasUsuarios = [
    { key: 'nome', label: 'Nome' },
    { key: 'id', label: 'ID', className: 'w-20' },
    { key: 'setor', label: 'Setor' },
    { key: 'funcao', label: 'FunÃ§Ã£o' },
    { key: 'turno', label: 'Turno' },
  ];

  const dadosUsuarios = [
    { id: 1, nome: 'Ana Silva', setor: 'Montagem', funcao: 'tal funcao', turno: 'ManhÃ£' },
    { id: 2, nome: 'Carlos Souza', setor: 'Qualidade', funcao: 'outra funcao', turno: 'Tarde' },
  ];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 pb-10">
      <SearchBar />
      <TableListagens data={dadosUsuarios} columns={colunasUsuarios} />
    </div>
  );
}

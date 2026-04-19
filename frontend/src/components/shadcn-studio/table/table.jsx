import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

import DropdownActions from '@/components/ui/dropdown-actions';

const TableListagens = ({ data, columns }) => {
  if (!data || !columns) return <p className="p-4">Nenhum dado disponível.</p>;

  return (
    <div className='w-full lg:w-4/5'>
      <div className='overflow-hidden rounded-md border bg-white/50 backdrop-blur-sm'>
        <Table>
          
          <TableHeader>
            <TableRow className="font-semibold bg-muted/50">
              {/* Renderiza as colunas dinâmicas */}
              {columns.map((col) => (
                <TableHead key={col.key} className={col.className}>
                  {col.label}
                </TableHead>
              ))}
              
              {/* COLUNA DE AÇÕES FIXA NO HEADER */}
              <TableHead className='text-right'>Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((row, index) => (
              <TableRow key={row.id || index} className='font-medium'>
                {/* Células de dados dinâmicos */}
                {columns.map((col) => (
                  <TableCell key={`${index}-${col.key}`} className={col.className}>
                    {row[col.key]}
                  </TableCell>
                ))}

                <TableCell className='text-right'>
                  <div className="flex justify-end">
                     <DropdownActions />
                  </div>
                </TableCell>
                
              </TableRow>
            ))}
          </TableBody>
          
        </Table>
      </div>
    </div>
  );
}

export default TableListagens;
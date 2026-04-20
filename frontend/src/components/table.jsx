import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

import { EllipsisVertical, EyeIcon, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const TableListagens = ({ data, columns, viewLink, dialogs }) => {
  if (!data || !columns) return <p className="p-4">Nenhum dado disponível.</p>;

  return (
    <div className='w-full px-8'>
      <div className='overflow-hidden rounded-md border bg-white/50 backdrop-blur-sm'>
        <Table>

          <TableHeader>
            <TableRow className="font-semibold bg-muted/50">
              {/* Renderiza as colunas dinâmicas (a coluna vai no page específico [Usuários, Máquinas ou Setores]) */}
              {columns.map((col) => (
                <TableHead key={col.key} className={col.className}>
                  {col.label}
                </TableHead>
              ))}

              {/* Essa coluna deve ter em todos */}
              <TableHead className='text-right'>Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((row, index) => (
              <TableRow key={row.id || index} className='font-medium'>
                {/* Renderiza linhas de dados dinâmicos */}
                {columns.map((col) => (
                  <TableCell key={`${index}-${col.key}`} className={col.className}>
                    {row[col.key]}
                  </TableCell>
                ))}

                <TableCell className='text-right'>
                  <div className="flex justify-end">

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='outline' className="border-none bg-transparent">
                          <EllipsisVertical />
                        </Button>
                      </DropdownMenuTrigger>
                      
                      <DropdownMenuContent align='end' className='w-46 font-semibold'>
                        <DropdownMenuGroup>

                          {/* link leva para a página específica (detalhes) */}
                          {viewLink && (
                            <DropdownMenuItem asChild>
                              <Link href={viewLink(row)} className="cursor-pointer">
                                <EyeIcon className="mr-2 h-4 w-4 text-[50px]" />
                                Ver Detalhes
                              </Link>
                            </DropdownMenuItem>
                          )}

                          {/* DIALOG DE EDITAR */}
                          {dialogs?.edit && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                                  <Pencil className='text-primary mr-2 h-4 w-4' />
                                  Editar
                                </DropdownMenuItem>
                              </DialogTrigger>
                              {dialogs.edit(row)}
                            </Dialog>
                          )}

                          {/* DIALOG DE EXCLUIR */}
                          {dialogs?.delete && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                                  <Trash2 className='text-vermelho-vivido mr-2 h-4 w-4'/>
                                  Excluir
                                </DropdownMenuItem>
                              </DialogTrigger>
                              {dialogs.delete(row)}
                            </Dialog>
                          )}

                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>

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
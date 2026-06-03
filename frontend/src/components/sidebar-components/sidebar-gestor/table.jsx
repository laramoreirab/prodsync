import Link from 'next/link'

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
  DialogTrigger
} from "@/components/ui/dialog";

import { EllipsisVertical, EyeIcon, Pencil, Trash2, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button'

import { useState, useEffect } from 'react';

import { usePagination } from '@/hooks/use-pagination';

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from '@tanstack/react-table';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationEllipsis,
} from '@/components/ui/pagination';


const TableListagens = ({ data, columns, viewLink, dialogs }) => {
  if (!data || !columns) return <p className="p-4">Nenhum dado disponível.</p>;

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [sorting, setSorting] = useState([
    {
      id: 'id', /* ordenar coluna por padrão */
      desc: false
    }
  ])

  const table = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      sorting,
      pagination
    }
  })

  /* Calculos botões da paginação */
  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage: table.getState().pagination.pageIndex + 1,
    totalPages: table.getPageCount(),
    paginationItemsToDisplay: 5
  })

  const currentPage = table.getState().pagination.pageIndex + 1;
  const pageSize = table.getState().pagination.pageSize;
  const totalItems = data.length;
  const rangeStart = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className='w-full px-8 mb-5'>
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
            {table.getRowModel().rows.map((row, index) => (
              <TableRow key={row.id || index} className='font-medium'>

                {/* Renderiza linhas de dados dinâmicos */}
                {columns.map((col) => (
                  <TableCell key={`${index}-${col.key}`} className={col.className}>
                    {/* original pois apenas row retorna undefined relacionada a paginação */}
                    {row.original[col.key]}
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
                              <Link href={viewLink(row.original)} className="cursor-pointer">
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
                              {dialogs.edit(row.original)}
                            </Dialog>
                          )}

                          {/* DIALOG DE EXCLUIR */}
                          {dialogs?.delete && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                                  <Trash2 className='text-vermelho-vivido mr-2 h-4 w-4' />
                                  Excluir
                                </DropdownMenuItem>
                              </DialogTrigger>
                              {dialogs.delete(row.original)}
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

      <div className='mt-3 flex flex-col items-center gap-1.5'>
        <Pagination className='w-auto'>
          <PaginationContent className='rounded-full border border-slate-200 bg-white/95 px-1.5 py-1 shadow-sm'>
            <PaginationItem className="flex items-center">
              <Button
                variant='outline'
                className='h-7 w-7 rounded-full border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-35'
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                aria-label='Página anterior'>
                <ChevronLeftIcon aria-hidden='true' strokeWidth={3} className='w-4 h-4' />
              </Button>
            </PaginationItem>

            {showLeftEllipsis && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {pages.map((page) => (
              <PaginationItem key={page}>
                <Button
                  size='icon'
                  variant='ghost'
                  className={`h-7 min-w-7 rounded-full px-2 text-[11px] sm:text-xs border ${page === currentPage ? 'border-primary/20 bg-primary/10 text-primary hover:bg-primary/15' : 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50'}`}
                  onClick={() => table.setPageIndex(page - 1)}
                >
                  {page}
                </Button>
              </PaginationItem>
            ))}

            {showRightEllipsis && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            <PaginationItem className="flex items-center">
              <Button
                variant='outline'
                className='h-7 w-7 rounded-full border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-35'
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                aria-label='Vá para a próxima página'>
                <ChevronRightIcon aria-hidden='true' strokeWidth={3} className='w-4 h-4' />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        <p className='text-[11px] sm:text-xs text-slate-500 font-medium'>
          Mostrando <span className='text-slate-700'>{rangeStart}</span>-<span className='text-slate-700'>{rangeEnd}</span> de{" "}
          <span className='text-slate-700'>{totalItems}</span>
        </p>
        
        {/* <div className='flex flex-1 justify-end'>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={value => {
              table.setPageSize(Number(value))
            }}>
            <SelectTrigger
              id='results-per-page'
              className='w-fit whitespace-nowrap'
              aria-label='Results per page'>
              <SelectValue placeholder='Select number of results' />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 25, 50].map(pageSize => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize} / page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div> */}
      </div>

    </div>
  );
}

export default TableListagens;
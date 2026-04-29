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

import { useState, useEffect, useMemo } from 'react';

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

import { Checkbox } from './ui/checkbox';

const TableListagens = ({ data, columns, viewLink, dialogs, enableSelection = false, onDeleteSelected }) => {
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

  /*   const pagesToShow = useMemo(() => {
      const total = table.getPageCount();
      const current = table.getState().pagination.pageIndex + 1;
  
      if (total <= 1) return [1];
  
      const pages = new Set();
  
      pages.add(1);
      if (total >= 2) pages.add(2);
      pages.add(current);
      if (total >= 3) pages.add(total - 1);
      pages.add(total);
  
      return Array.from(pages).filter(p => p > 0 && p <= total).sort((a, b) => a - b);
    }, [table.getPageCount(), table.getState().pagination.pageIndex]);
  
    const currentPage = table.getState().pagination.pageIndex + 1;
    const totalPages = table.getPageCount(); */

  const [rowSelection, setRowSelection] = useState({});

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
      pagination,
      rowSelection
    },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
  })

  const selectedRows = table.getSelectedRowModel().rows;

  /* Calculos botões da paginação */
  const { showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage: table.getState().pagination.pageIndex + 1,
    totalPages: table.getPageCount(),
    paginationItemsToDisplay: 5
  })

  return (
    <div className='w-full mb-5'>

      {enableSelection && selectedRows.length > 0 && (
        <div className="flex items-center justify-between p-3 mb-4 rounded-md border border-primary bg-primary/5 animate-in fade-in slide-in-from-top-2 w-full">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-vermelho-vivido text-md text-white font-bold">
              {selectedRows.length}
            </span>
            <p className="text-sm font-medium text-vermelho-vivido">
              Itens selecionados
            </p>
          </div>

          <Button
            className="h-8 bg-vermelho-vivido text-white"
            onClick={() => {
              const selectedData = selectedRows.map(row => row.original);
              onDeleteSelected?.(selectedData); // Passa os dados para o componente pai
            }}
          >
            <Trash2 className="mr-1 h-4 w-4" />
            Excluir
          </Button>
        </div>
      )}

      <div className='overflow-hidden rounded-md border bg-white/50 backdrop-blur-sm w-full'>
        <Table className="overflow-auto">

          <TableHeader>
            <TableRow className="font-semibold bg-muted/50">

              {enableSelection && (
                <TableHead className="w-12.5">
                  <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Selecionar todos"
                  />
                </TableHead>
              )}

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
              <TableRow
                key={row.id || index}
                className='font-medium'
                data-state={row.getIsSelected() && "selected"} > {/* linhas selecioanada */}

                {enableSelection && (
                  <TableCell>
                    <Checkbox
                      checked={row.getIsSelected()}
                      onCheckedChange={(value) => row.toggleSelected(!!value)}
                      aria-label="Selecionar linha"
                    />
                  </TableCell>
                )}

                {/* Renderiza linhas de dados dinâmicos */}
                {columns.map((col) => (
                  <TableCell key={`${row.id}-${col.key}`} className={col.className}>

                    {col.badge
                      ? (col.badge(row.original[col.key], row.original) ?? null)
                      : (row.original?.[col.key] ?? null)
                    }

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

      <div className='flex items-center max-sm:flex-col mt-7 justify-center text-center'>

        <div className='grow items-center'>
          <Pagination>
            <PaginationContent>
              <PaginationItem className="flex items-center">
                <Button
                  className='disabled:pointer-events-none disabled:opacity-100 bg-primary border-none text-white w-9 h-8'
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label='Página anterior'>
                  <ChevronLeftIcon aria-hidden='true'
                    strokeWidth={3}
                    size={16} />
                </Button>
              </PaginationItem>

              {showLeftEllipsis && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              <p
                className='text-muted-foreground flex-1 text-2x1 whitespace-nowrap text-left mx-2 font-medium'
                aria-live='polite'>
                Página <span className='text-foreground'>{table.getState().pagination.pageIndex + 1}</span> de{' '}
                <span className='text-foreground'>{table.getPageCount()}</span>
              </p>

              {showRightEllipsis && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              <PaginationItem className="flex items-center">
                <Button
                  className='disabled:pointer-events-none disabled:opacity-100 bg-primary border-none text-white w-9 h-8'
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label='Vá para a próxima página'>
                  <ChevronRightIcon aria-hidden='true'
                    strokeWidth={3}
                    className='!w-7 !h-7' />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

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
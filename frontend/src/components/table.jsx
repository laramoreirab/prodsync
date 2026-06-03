"use client";

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

import { EllipsisVertical, Pencil, Trash2, ChevronLeftIcon, ChevronRightIcon, BellRing } from 'lucide-react';
import { Button } from '@/components/ui/button'

import { useState, useMemo, useEffect } from 'react';

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

const TableListagens = ({ data, columns, enableSelection = false, excluirLote, editarLote, solicitarJustificativa, onSelectedChange, acoesDropdown }) => {
  if (!data || !columns) return <p className="p-4">Nenhum dado disponível.</p>;

  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState([]);

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
  })

  const pagesToShow = useMemo(() => {
    const total = table.getPageCount();
    const current = table.getState().pagination.pageIndex + 1;

    if (total <= 1) return [1];

    const pages = new Set();

    pages.add(1);
    pages.add(current);
    pages.add(total);

    return Array.from(pages).filter(p => p > 0 && p <= total).sort((a, b) => a - b);
  }, [table.getPageCount(), table.getState().pagination.pageIndex]);

  const currentPage = table.getState().pagination.pageIndex + 1;
  const pageSize = table.getState().pagination.pageSize;
  const totalItems = data.length;
  const rangeStart = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, totalItems);
  const selectedRows = table.getSelectedRowModel().rows;
  const hasSelection = selectedRows.length > 0;

  useEffect(() => {
    onSelectedChange?.(selectedRows.map(row => row.original));
  }, [rowSelection]);

  const barraSelecionados = enableSelection && hasSelection && (excluirLote || editarLote || solicitarJustificativa);

  /* const handleBatchDelete = () => {
    const selectedData = selectedRows.map(row => row.original);
    onDeleteSelected?.(selectedData);
  };
 
  const handleBatchEdit = () => {
    const selectedData = selectedRows.map(row => row.original);
    onEditSelected?.(selectedData);
  }; */

  return (
    <div className='w-full mb-5'>

      {barraSelecionados && (
        <div className="flex items-center justify-between p-3 mb-4 rounded-md border border-primary bg-primary/5 w-full dark:border-[#365b94] dark:bg-[#10203a]">
          <div className="flex items-center gap-1">
            <span className="flex items-center justify-center text-md text-primary font-medium">
              {selectedRows.length}
            </span>
            <p className="text-sm font-medium text-primary">
              {selectedRows.length === 1 ? 'item selecionado' : 'itens selecionados'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Botão de edição em lote — só aparece se onEditSelected foi passado */}
            {/* {editarLote && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="h-8 bg-primary text-white">
                    <Pencil className="mr-1 h-4 w-4" />
                    Editar
                  </Button>
                </DialogTrigger>
                {editarLote}
              </Dialog>
            )} */}

            {solicitarJustificativa && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="h-8 border-primary text-primary hover:bg-primary/10">
                    <BellRing className="mr-1 h-4 w-4" />
                    Solicitar Justificativa
                  </Button>
                </DialogTrigger>
                {solicitarJustificativa}
              </Dialog>
            )}

            {/* Botão de exclusão em lote — só aparece se onDeleteSelected foi passado */}
            {excluirLote && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="h-8 bg-vermelho-vivido text-white cursor-pointer">
                    <Trash2 className="mr-1 h-4 w-4" />
                    Excluir
                  </Button>
                </DialogTrigger>
                {excluirLote}
              </Dialog>
            )}
          </div>
        </div>
      )}

      <div className='overflow-x-auto rounded-lg border border-slate-200 bg-white/80 backdrop-blur-sm w-full shadow-sm dark:border-[#1d2d49] dark:bg-[#07101f] dark:shadow-[0_18px_50px_rgba(0,0,0,0.28)]'>
        <Table className="overflow-auto">

          <TableHeader>
            <TableRow className="font-semibold bg-[#eef3fb] h-14 text-[#17233b] dark:bg-[#101b31] dark:text-[#e7eefc]">

              {enableSelection && (
                <TableHead className="w-12.5">
                  <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Selecionar todos"
                    className="cursor-pointer"
                  />
                </TableHead>
              )}

              {/* Renderiza as colunas dinâmicas (a coluna vai no page específico [Usuários, Máquinas ou Setores]) */}
              {columns.map((col) => (
                <TableHead key={col.key} className={col.className}>
                  {col.label}
                </TableHead>
              ))}

              {acoesDropdown && (
                <TableHead className='text-right'>Ações</TableHead>
              )}

            </TableRow>
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.map((row, index) => (
              <TableRow
                key={row.id || index}
                className='font-medium h-14 border-slate-200/80 text-[#23304c] transition-colors hover:bg-slate-50/80 dark:border-[#1d2d49] dark:text-[#d7e2f4] dark:hover:bg-[#101b31]'
                data-state={row.getIsSelected() ? "selected" : undefined} > {/* linhas selecioanada */}

                {enableSelection && (
                  <TableCell>
                    <Checkbox
                      checked={row.getIsSelected()}
                      onCheckedChange={(value) => row.toggleSelected(!!value)}
                      aria-label="Selecionar linha"
                      className="cursor-pointer"
                    />
                  </TableCell>
                )}

                {/* Renderiza linhas de dados dinâmicos */}
                {columns.map((col) => (
                  <TableCell key={`${row.id}-${col.key}`} className={col.className}>

                    {col.icone
                      ? (col.icone(row.original[col.key], row.original) ?? null)
                      : (row.original?.[col.key] ?? null)
                    }

                  </TableCell>
                ))}

                {acoesDropdown && (
                  <TableCell className='text-right'>
                    <div className="flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='outline' className="border-none bg-transparent cursor-pointer text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-[#aebbd1] dark:hover:bg-[#17253f] dark:hover:text-[#f4f8ff]">
                            <EllipsisVertical />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align='end' className='max-w-62 w-auto font-semibold pr-2'>
                          {acoesDropdown && acoesDropdown(row.original)}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                )}



              </TableRow>
            ))}
          </TableBody>

        </Table>
      </div>

      <div className='mt-3 flex flex-col items-center gap-1.5'>
        <Pagination className='w-auto'>
          <PaginationContent className='rounded-full border border-slate-200 bg-white/95 px-1.5 py-1 shadow-sm dark:border-[#243754] dark:bg-[#07101f]'>

            <PaginationItem className="flex items-center">
              <Button
                variant='outline'
                className='h-7 w-7 rounded-full border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-35 cursor-pointer dark:border-[#243754] dark:bg-[#0b1324] dark:text-[#aebbd1] dark:hover:bg-[#17253f] dark:hover:text-[#f4f8ff]'
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                aria-label='Página anterior'>
                <ChevronLeftIcon aria-hidden='true'
                  strokeWidth={3}
                  size={16} />
              </Button>
            </PaginationItem>

            {pagesToShow.map((page, index) => {
              const pageAnterior = pagesToShow[index - 1];

              const showEllipsis = pageAnterior && page - pageAnterior > 1;

              return (
                <div key={page} className='flex items-center'>
                  {showEllipsis && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}

                  <PaginationItem>
                    <Button
                      size='icon'
                      variant='ghost'
                      className={`h-7 min-w-7 rounded-full px-2 text-[11px] sm:text-xs cursor-pointer border ${page === currentPage ? 'border-primary/20 bg-primary/10 text-primary hover:bg-primary/15 dark:border-[#6f9bff]/30 dark:bg-[#17345f] dark:text-[#dbe8ff]' : 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 dark:text-[#aebbd1] dark:hover:border-[#243754] dark:hover:bg-[#17253f]'}`}
                      onClick={() => table.setPageIndex(page - 1)}
                    >
                      {page}
                    </Button>
                  </PaginationItem>
                </div>
              );
            })}

            <PaginationItem className="flex items-center">
              <Button
                variant='outline'
                className='h-7 w-7 rounded-full border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-35 cursor-pointer dark:border-[#243754] dark:bg-[#0b1324] dark:text-[#aebbd1] dark:hover:bg-[#17253f] dark:hover:text-[#f4f8ff]'
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                aria-label='Vá para a próxima página'>
                <ChevronRightIcon aria-hidden='true'
                  strokeWidth={3}
                  className='w-5! h-5!' />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        <p
          className='text-[11px] sm:text-xs text-slate-500 font-medium dark:text-[#aebbd1]'
          aria-live='polite'>
          Mostrando <span className='text-slate-700 dark:text-[#f4f8ff]'>{rangeStart}</span>-<span className='text-slate-700 dark:text-[#f4f8ff]'>{rangeEnd}</span> de{" "}
          <span className='text-slate-700 dark:text-[#f4f8ff]'>{totalItems}</span>
        </p>
      </div>

    </div>
  );
}

export default TableListagens;

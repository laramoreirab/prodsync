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

import { EllipsisVertical, EyeIcon, Pencil, Trash2, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button'

import { useState, useMemo } from 'react';

// import { usePagination } from '@/hooks/use-pagination';

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

const TableListagens = ({ data, columns, enableSelection = false, onDeleteSelected, onEditSelected, acoesDropdown }) => {
  if (!data || !columns) return <p className="p-4">Nenhum dado disponível.</p>;

  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState([
    {
      id: 'id', /* ordenar coluna por padrão */
      desc: false
    }
  ]);

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
  const selectedRows = table.getSelectedRowModel().rows;
  const hasSelection = selectedRows.length > 0;

  const showBatchBar = enableSelection && hasSelection && (onDeleteSelected || onEditSelected);
 
  const handleBatchDelete = () => {
    const selectedData = selectedRows.map(row => row.original);
    onDeleteSelected?.(selectedData);
  };
 
  const handleBatchEdit = () => {
    const selectedData = selectedRows.map(row => row.original);
    onEditSelected?.(selectedData);
  };

  return (
    <div className='w-full mb-5'>

      {showBatchBar && (
        <div className="flex items-center justify-between p-3 mb-4 rounded-md border border-primary bg-primary/5 animate-in fade-in slide-in-from-top-2 w-full">
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
            {onEditSelected && (
              <Button
                className="h-8 bg-primary text-white"
                onClick={handleBatchEdit}
              >
                <Pencil className="mr-1 h-4 w-4" />
                Editar
              </Button>
            )}

            {/* Botão de exclusão em lote — só aparece se onDeleteSelected foi passado */}
            {onDeleteSelected && (
              <Button
                className="h-8 bg-vermelho-vivido text-white"
                onClick={handleBatchDelete}
              >
                <Trash2 className="mr-1 h-4 w-4" />
                Excluir
              </Button>
            )}
          </div>
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

                    {col.icone
                      ? (col.icone(row.original[col.key], row.original) ?? null)
                      : (row.original?.[col.key] ?? null)
                    }

                  </TableCell>
                ))}

                <TableCell className='text-right'>
                  <div className="flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='outline' className="border-none bg-transparent cursor-pointer">
                          <EllipsisVertical />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align='end' className='max-w-62 w-auto font-semibold pr-2'>
                        {acoesDropdown && acoesDropdown(row.original)}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>

        </Table>
      </div>

      <div className='flex flex-col items-center gap-3 mt-2'>
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
                      variant={page === currentPage ? 'outline' : 'ghost'}
                      className={`w-9 h-8 ${page === currentPage ? 'border-2 border-primary/20' : ''}`}
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
                className='disabled:pointer-events-none disabled:opacity-100 bg-primary border-none text-white w-9 h-8'
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
          className='text-muted-foreground flex-1 text-2x1 whitespace-nowrap text-left mx-2 font-medium'
          aria-live='polite'>
          Página <span className='text-foreground'>{table.getState().pagination.pageIndex + 1}</span> de{' '}
          <span className='text-foreground'>{table.getPageCount()}</span>
        </p>

      </div>

    </div>
  );
}

export default TableListagens;
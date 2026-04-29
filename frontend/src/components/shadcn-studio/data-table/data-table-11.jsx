'use client';

import { useEffect, useState, useMemo } from 'react';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon } from 'lucide-react';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem 
} from '@/components/ui/pagination';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

import { cn } from '@/lib/utils';

const columns = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    size: 28,
    enableSorting: false
  },
  {
    header: 'Product Name',
    accessorKey: 'product_name',
    cell: ({ row }) => <div className='font-medium'>{row.getValue('product_name')}</div>
  },
  {
    header: 'Price',
    accessorKey: 'price',
    cell: ({ row }) => <div className='font-medium'>{row.getValue('price')}</div>
  },
  {
    header: 'Availability',
    accessorKey: 'availability',
    cell: ({ row }) => {
      const availability = row.getValue('availability');

      const styles = {
        'In Stock': 'bg-green-600/10 text-green-600 dark:bg-green-400/10 dark:text-green-400',
        'Out of Stock': 'bg-destructive/10 text-destructive',
        'Limited': 'bg-amber-600/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400'
      };

      return (
        <Badge variant="outline" className={cn('border-none', styles[availability])}>
          {availability}
        </Badge>
      );
    }
  }
];

const DataTableWithPaginationDemo = () => {
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([{ id: 'product_name', desc: false }]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('https://cdn.jsdelivr.net/gh/themeselection/fy-assets/assets/json/mobile-stock.json');
        if (!res.ok) throw new Error('Failed to fetch data');
        const items = await res.json();
        // Duplicando os dados para garantir que tenhamos muitas páginas
        setData([...items.data, ...items.data, ...items.data, ...items.data]);
      } catch (error) {
        console.error(error);
      }
    }
    fetchPosts();
  }, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: { sorting, pagination },
  });

  // Lógica de Paginação: 2 primeiras + Atual + 2 últimas
  const pagesToShow = useMemo(() => {
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
  const totalPages = table.getPageCount();

  return (
    <div className='w-full space-y-4 p-4'>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className='hover:bg-transparent'>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} style={{ width: `${header.getSize()}px` }} className='h-11'>
                    {header.column.getCanSort() ? (
                      <div
                        className='flex h-full cursor-pointer items-center justify-between gap-2 select-none'
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: <ChevronUpIcon size={16} className='opacity-60' />,
                          desc: <ChevronDownIcon size={16} className='opacity-60' />
                        }[header.column.getIsSorted()] ?? null}
                      </div>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className='flex flex-col items-center gap-4'>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button
                size='icon'
                variant='outline'
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className='h-9 w-9'
              >
                <ChevronLeftIcon size={16} />
              </Button>
            </PaginationItem>

            {pagesToShow.map((page, index) => {
              const prevPage = pagesToShow[index - 1];
              const showEllipsis = prevPage && page - prevPage > 1;

              return (
                <div key={page} className="flex items-center">
                  {showEllipsis && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <Button
                      size='icon'
                      variant={page === currentPage ? 'outline' : 'ghost'}
                      className={cn(
                        "h-9 w-9",
                        page === currentPage && "border-2 border-primary/20"
                      )}
                      onClick={() => table.setPageIndex(page - 1)}
                    >
                      {page}
                    </Button>
                  </PaginationItem>
                </div>
              );
            })}

            <PaginationItem>
              <Button
                size='icon'
                variant='outline'
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className='h-9 w-9'
              >
                <ChevronRightIcon size={16} />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        <p className='text-muted-foreground text-sm'>
          Página <span className='text-foreground font-medium'>{currentPage}</span> de{' '}
          <span className='text-foreground font-medium'>{totalPages}</span>
        </p>
      </div>
    </div>
  );
};

export default DataTableWithPaginationDemo;
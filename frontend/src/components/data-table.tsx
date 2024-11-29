'use client';

import React, { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  SortingState,
  ColumnFiltersState,
  ColumnDef,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Pagination } from '@/types/global';

interface DataTableProps<T> {
  data: {
    data: T[];
    pagination: Pagination;
  };
  onPageChange: (
    page: number
  ) => Promise<{ data: T[]; pagination: Pagination }>;
  onSearch: (search: string) => Promise<{
    data: T[];
    pagination: Pagination;
  }>;
  columns: ColumnDef<T>[];
}

export const DataTable = <T,>({
  data,
  onPageChange,
  onSearch,
  columns,
}: DataTableProps<T>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [tableData, setTableData] = useState(data.data);
  const [pagination, setPagination] = useState(data.pagination);
  const [search, setSearch] = useState('');

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handlePageChange = async (page: number) => {
    const { data: newData, pagination: newPagination } = await onPageChange(
      page
    );
    setTableData(newData);
    setPagination(newPagination);
  };

  const debouncedSearch = useDebouncedCallback(async (search: string) => {
    const { data: newData, pagination: newPagination } = await onSearch(search);
    setTableData(newData);
    setPagination(newPagination);
  }, 500);

  const handleSearch = (search: string) => {
    setSearch(search);
    debouncedSearch(search);
  };

  return (
    <div className='space-y-4'>
      {/* Global Search Input */}
      <div className='flex items-center justify-between'>
        <Input
          placeholder='Search items...'
          value={search ?? ''}
          onChange={(e) => handleSearch(e.target.value)}
          className='max-w-sm'
        />

        {/* Date Sorting Select */}
        <Select
          onValueChange={(value) => {
            setSorting([
              {
                id: 'createdAt',
                desc: value === 'desc',
              },
            ]);
          }}
        >
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Sort by Date' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='asc'>Date (Ascending)</SelectItem>
            <SelectItem value='desc'>Date (Descending)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className='cursor-pointer'
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  {header.column.getIsSorted()
                    ? header.column.getIsSorted() === 'desc'
                      ? ' ↓'
                      : ' ↑'
                    : null}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className='flex items-center justify-between space-x-2 py-4'>
        <div className='flex-1 text-sm text-muted-foreground'>
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>

        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => handlePageChange(1)}
            disabled={pagination.currentPage === 1}
          >
            <ChevronsLeft className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
          >
            <ChevronLeft className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
          >
            <ChevronRight className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => handlePageChange(pagination.totalPages)}
            disabled={pagination.currentPage === pagination.totalPages}
          >
            <ChevronsRight className='h-4 w-4' />
          </Button>
        </div>
        <div className='text-sm text-muted-foreground'>
          Page {pagination.currentPage} of {pagination.totalPages}
        </div>
      </div>
    </div>
  );
};

export default DataTable;

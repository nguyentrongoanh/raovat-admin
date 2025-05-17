'use client';

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Blocks } from 'react-loader-spinner';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Function to get cell content by column ID
  const getCellContent = (row: any, columnId: string) => {
    const cell = row.getVisibleCells().find((cell: any) => cell.column.id === columnId);
    return cell ? flexRender(cell.column.columnDef.cell, cell.getContext()) : null;
  };

  // Function to get header content by column ID
  const getHeaderContent = (columnId: string) => {
    const headerGroup = table.getHeaderGroups()[0];
    const header = headerGroup?.headers.find(h => h.column.id === columnId);
    return header ? (header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())) : null;
  };

  return (
    <div className='w-full'>
      {/* Desktop Table View (hidden on small screens) */}
      <div className='hidden sm:block overflow-x-auto'>
        <div className='min-w-full'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <TableHead
                      key={header.id}
                      className={`px-2 py-3 text-xs md:text-sm whitespace-nowrap font-semibold text-gray-700 bg-gray-50 ${header.column.id === 'tieu_de' ? 'text-left' : 'text-center'}`}
                      style={{
                        width: header.column.id === 'tieu_de' ? '300px' : header.column.id === 'id' ? '150px' : header.column.id === 'ngay_dang' ? '120px' : header.column.id === 'active' ? '90px' : header.column.id === 'is_vip' ? '80px' : header.column.id === 'actions' ? '70px' : 'auto',
                      }}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map(row => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className={`
                      transition-colors duration-200
                      hover:bg-indigo-50 hover:bg-opacity-70
                      ${row.getIsSelected() ? 'bg-indigo-50 bg-opacity-80' : 'even:bg-gray-50 even:bg-opacity-30'}
                    `}
                  >
                    {row.getVisibleCells().map(cell => (
                      <TableCell
                        key={cell.id}
                        className={`px-2 py-3 text-xs md:text-sm border-b border-gray-100 ${cell.column.id === 'tieu_de' ? 'text-left' : 'text-center'}`}
                        style={{
                          width: cell.column.id === 'tieu_de' ? '300px' : cell.column.id === 'id' ? '150px' : cell.column.id === 'ngay_dang' ? '120px' : cell.column.id === 'active' ? '90px' : cell.column.id === 'is_vip' ? '80px' : cell.column.id === 'actions' ? '70px' : 'auto',
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className='h-24 text-center'>
                    <div className='flex justify-center items-center'>
                      <Blocks visible={true} height='40' width='40' ariaLabel='blocks-loading' wrapperClass='blocks-wrapper' />
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Mobile Card View (visible only on small screens) */}
      <div className='sm:hidden'>
        {table.getRowModel().rows?.length ? (
          <div className='divide-y divide-gray-100'>
            {table.getRowModel().rows.map(row => (
              <div key={row.id} className='bg-white overflow-hidden border border-gray-100 rounded-lg shadow-sm mb-3 hover:shadow-md transition-shadow duration-200'>
                <div className='p-4'>
                  {/* Header with ID and Actions */}
                  <div className='flex justify-between items-center mb-2'>
                    <div className='text-xs font-medium text-gray-500 truncate max-w-[70%]'>
                      <span className='mr-1'>ID:</span>
                      <span className='font-mono'>{getCellContent(row, 'id')}</span>
                    </div>
                    <div>{getCellContent(row, 'actions')}</div>
                  </div>

                  {/* Title */}
                  <h3 className='text-sm font-bold text-gray-900 mb-3 line-clamp-2'>{getCellContent(row, 'tieu_de')}</h3>

                  {/* Date and Status */}
                  <div className='flex flex-wrap justify-between items-center text-xs text-gray-600 mb-1'>
                    <div className='flex items-center'>
                      <svg xmlns='http://www.w3.org/2000/svg' className='h-3 w-3 mr-1' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                      </svg>
                      {getCellContent(row, 'ngay_dang')}
                    </div>
                    <div className='flex items-center mt-1 sm:mt-0'>
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-4 font-medium rounded-full
                        ${row.getValue('active') === true ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                      >
                        {row.getValue('active') === true ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                    </div>
                  </div>

                  {/* VIP Status */}
                  {row.getValue('is_vip') === true && (
                    <div className='mt-1 flex items-center text-yellow-500 text-xs'>
                      <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4 mr-1' viewBox='0 0 20 20' fill='currentColor'>
                        <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                      </svg>
                      <span>Tin VIP</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='flex justify-center items-center h-24'>
            <Blocks visible={true} height='40' width='40' ariaLabel='blocks-loading' wrapperClass='blocks-wrapper' />
          </div>
        )}
      </div>
    </div>
  );
}

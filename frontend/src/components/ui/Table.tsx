import { ReactNode } from 'react';

interface Column {
  header: string;
  accessor: string;
  render?: (value: any, row: any) => ReactNode;
}

interface TableProps {
  columns: Column[];
  data: any[];
  onRowClick?: (row: any) => void;
}

export const Table = ({ columns, data, onRowClick }: TableProps) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/[0.06] bg-[#111827]">
      <table className="min-w-full text-white">
        <thead className="bg-white/[0.04]">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-[#9CA3AF]">
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() => onRowClick?.(row)}
                className="border-t border-white/[0.06] hover:bg-white/[0.04] transition"
              >
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 text-sm text-[#E5E7EB]">
                    {column.render
                      ? column.render(row[column.accessor], row)
                      : row[column.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};



// Pagination

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange
}: PaginationProps) => {

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-between mt-6 text-white">

      <p className="text-sm text-[#9CA3AF]">
        Page {currentPage} of {totalPages}
      </p>

      <div className="flex gap-2">

        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.10] disabled:opacity-40 text-[#E5E7EB] transition"
        >
          Prev
        </button>

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`
              px-3 py-1 rounded-lg transition
              ${page === currentPage
                ? 'bg-[#4F46E5] text-white'
                : 'bg-white/[0.06] hover:bg-white/[0.10] text-[#E5E7EB]'}
            `}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.10] disabled:opacity-40 text-[#E5E7EB] transition"
        >
          Next
        </button>

      </div>
    </div>
  );
};
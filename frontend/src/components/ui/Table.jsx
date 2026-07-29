import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Table({ columns, data, pagination = false }) {
  return (
    <div className="w-full bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-foreground/80">
          <thead className="text-xs text-foreground/50 uppercase bg-card-secondary border-b border-border">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-4 font-medium tracking-wider">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-foreground/5 transition-colors group">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                    {col.cell ? col.cell(row) : row[col.accessorKey]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        
        {data.length === 0 && (
          <div className="p-8 text-center text-foreground/40">
            No data available.
          </div>
        )}
      </div>

      {pagination && data.length > 0 && (
        <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-card-secondary/50">
          <span className="text-xs text-foreground/50">Showing 1 to {data.length} entries</span>
          <div className="flex gap-2">
            <button className="p-1 rounded bg-foreground/5 text-foreground/50 hover:text-foreground hover:bg-foreground/10 disabled:opacity-50">
              <ChevronLeft size={16} />
            </button>
            <button className="p-1 rounded bg-foreground/5 text-foreground/50 hover:text-foreground hover:bg-foreground/10 disabled:opacity-50">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

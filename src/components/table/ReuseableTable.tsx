/* eslint-disable @typescript-eslint/no-explicit-any */
// components/Table.tsx
import React from 'react';

interface TableProps<T> {
  data: T[]; // Array of objects representing rows
  columns: string[]; // Array of keys to display as columns
  rowsPerPage: number; // Number of rows to display per page
  currentPage: number; // Current page number
}

export default function ReuseableTable<T>({ data, columns, rowsPerPage, currentPage }: TableProps<T>) {
  // Calculate the start and end indices for the current page
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  return (
    <div>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column} style={{ border: '1px solid white ', padding: '8px' }} className='capitalize'>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, rowIndex) => (
            <tr key={startIndex + rowIndex}>
              {columns.map((column) => (
                <td key={column} style={{ border: '1px solid white', padding: '8px' }}>
                  {(row as any)[column]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {/* <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
          disabled={currentPage === 1}
          onClick={() => alert('Previous Page')}
          style={{ padding: '8px 16px', marginRight: '8px' }}
        >
          Previous
        </button>
        <span style={{ margin: '0 16px' }}>Page {currentPage}</span>
        <button
          disabled={endIndex >= data.length}
          onClick={() => alert('Next Page')}
          style={{ padding: '8px 16px' }}
        >
          Next
        </button>
      </div> */}
    </div>
  );
}
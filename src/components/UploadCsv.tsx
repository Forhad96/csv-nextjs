
'use client'; // This is a client component

import { useState } from 'react';
import ReuseableTable from './table/ReuseableTable';


interface CsvRecord {
  [key: string]: string; // Adjust this based on your CSV structure
}

export default function UploadCSV() {
  const [data, setData] = useState<CsvRecord[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10); // Set the number of rows per page

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result?.toString().split(',')[1]; // Get the base64 part of the file

      if (base64) {
        const response = await fetch('/api/parse-csv', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ csvData: base64 }),
        });

        const result = await response.json();
        setData(result.data);
      }
    };

    reader.readAsDataURL(file); // Read the file as a base64 string
  };

  const columns = data && Object.keys(data[0]);
  const totalPages = data ? Math.ceil(data.length / rowsPerPage) : 0;

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className=" shadow-lg rounded-lg p-8 w-full max-w-5xl">
        {/* Header */}
        <h1 className="text-2xl font-bold text-center  mb-6">Upload CSV File</h1>

        {/* File Upload Section */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <label
            htmlFor="file-upload"
            className="w-full flex items-center justify-center px-6 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <span className="">Choose a CSV file or drag it here</span>
            <input
              id="file-upload"
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
          <p className="text-sm text-gray-500">Supported formats: .csv</p>
        </div>

        {/* Display Parsed Data */}
        {data && columns && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold  mb-4">Parsed Data</h2>
            <ReuseableTable data={data} columns={columns} rowsPerPage={rowsPerPage} currentPage={currentPage} />

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
                className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
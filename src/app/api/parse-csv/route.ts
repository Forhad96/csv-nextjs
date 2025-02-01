// app/api/parse-csv/route.ts
import { NextResponse } from 'next/server';
import csvParser from 'csv-parser';
import { Readable } from 'stream';

interface CsvRecord {
  [key: string]: string; // Adjust this based on your CSV structure
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { csvData }: { csvData: string } = body;

    // Convert base64 back to a buffer
    const buffer = Buffer.from(csvData, 'base64');

    // Create a readable stream from the buffer
    const stream = Readable.from(buffer);

    const records: CsvRecord[] = [];

    return new Promise((resolve, reject) => {
      stream
        .pipe(csvParser())
        .on('data', (row: CsvRecord) => {
            // Replace '�' with '-' in each field of the row
            const cleanedRow: CsvRecord = {};
            for (const key in row) {
              cleanedRow[key] = row[key].replace(/�/g, '-');
            }
            records.push(cleanedRow);
          })
        .on('end', () => {
          resolve(NextResponse.json({ data: records }));
        })
        .on('error', (error: Error) => {
          console.error('Error parsing CSV:', error);
          reject(NextResponse.json({ error: 'Failed to parse CSV' }, { status: 500 }));
        });
    });
  } catch (error) {
    console.error('Error parsing CSV:', error);
    return NextResponse.json({ error: 'Failed to parse CSV' }, { status: 500 });
  }
}
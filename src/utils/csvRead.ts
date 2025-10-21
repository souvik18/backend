import fs from 'fs';
import { parse } from 'csv-parse';
import type { RecordType } from '../schemas/recordSchema';

export function csvRead<Type = RecordType>(filePath: string): Promise<Type[]> {
  return new Promise((resolve, reject) => {
    const records: Type[] = [];

    fs.createReadStream(filePath)
      .pipe(
        parse({
          columns: true,
          skip_empty_lines: true,
          trim: true,
          encoding: 'utf-8'
        }),
      )
      .on('data', (data: any) => {
        const mapped: any = {
          reference: Number(data['Reference']),
          accountNumber: data['Account Number'],
          description: data['Description'],
          startBalance: Number(data['Start Balance']),
          mutation:
            data['Mutation'].startsWith('+') || data['Mutation'].startsWith('-')
              ? data['Mutation']
              : `+${data['Mutation']}`,
          endBalance: Number(data['End Balance']),
        };

        records.push(mapped);
      })
      .on('end', () => resolve(records))
      .on('error', (err) => reject(err));
  });
}

import fs from 'fs';
import { XMLParser } from 'fast-xml-parser';

export async function xmlRead<Type = any>(filePath: string): Promise<Type[]> {
  const xmlData = fs.readFileSync(filePath, 'utf-8');

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
    trimValues: true,
    parseTagValue: false,
  });

  const parsed = parser.parse(xmlData);
  let records = parsed?.records?.record;

  if (!Array.isArray(records)) {
    records = [records];
  }

  const convertedRecords = records.map((rec: any) => {
    return {
      ...rec,
      reference: Number(rec.reference),
    };
  });

  return convertedRecords;
}

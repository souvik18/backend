import { MESSAGES } from '../constant.ts';
import {
  formatZodIssues,
  recordSchema,
  type RecordType,
} from '../schemas/recordSchema.ts';
import type {
  CorrectDataRecord,
  FailedRecord,
  ValidationResult,
} from '../type.ts';

export function validateRecords(rawRecords: RecordType[]): ValidationResult {
  const processedReferences = new Set<number>();
  const valid: RecordType[] = [];
  const failed: FailedRecord[] = [];
  const correctData: CorrectDataRecord[] = [];

  for (const record of rawRecords) {
    const result = recordSchema.safeParse(record);

    if (!result.success) {
      failed.push({
        reference: Number(record.reference || 0),
        description: record.description || '',
        reason: formatZodIssues(result.error.issues),
      });
      continue;
    }

    const parsedRecord = result.data;

    if (processedReferences.has(parsedRecord.reference)) {
      failed.push({
        reference: parsedRecord.reference,
        description: parsedRecord.description,
        reason: MESSAGES.duplicateTransaction,
      });
      continue;
    }

    processedReferences.add(parsedRecord.reference);

    const calculatedEndBalance = parseFloat(
      (parsedRecord.startBalance + parsedRecord.mutation).toFixed(2),
    );

    if (calculatedEndBalance !== parsedRecord.endBalance) {
      failed.push({
        reference: parsedRecord.reference,
        description: parsedRecord.description,
        reason: MESSAGES.incorrectEndBalance,
      });
      continue;
    }

    valid.push(parsedRecord);
    correctData.push({
      reference: parsedRecord.reference,
      description: parsedRecord.description,
    });
  }

  return { valid, failed, correctData };
}

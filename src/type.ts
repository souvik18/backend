import type { RecordType } from './schemas/recordSchema';

export type FailedRecord = {
  reference: number;
  description: string;
  reason: string;
};

export type CorrectDataRecord = {
  reference: number;
  description: string;
};

export type ValidationResult = {
  valid: RecordType[];
  failed: FailedRecord[];
  correctData: CorrectDataRecord[];
};

export interface SuccessResponse {
  success: boolean;
  totalRecords: number;
  validCount: number;
  failedCount: number;
  failedRecords: FailedRecord[];
  successfulRecords: CorrectDataRecord[];
}

export interface ErrorResponse {
  success?: boolean;
  error: string;
  details?: string;
}

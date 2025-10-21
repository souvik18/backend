import type { Request, Response } from 'express';
import type { SuccessResponse, ErrorResponse } from '../type.ts';
import { MESSAGES } from '../constant.ts';
import type { RecordType } from '../schemas/recordSchema.ts';
import path from 'path';
import { csvRead } from '../utils/csvRead.ts';
import { xmlRead } from '../utils/xmlRead.ts';
import { validateRecords } from '../validation/validator.ts';

export const customerRecordsController = async (
  req: Request,
  res: Response<SuccessResponse | ErrorResponse>,
): Promise<Response<SuccessResponse | ErrorResponse>> => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: MESSAGES.noFileUploaded,
    });
  }

  const extension = path.extname(req.file.originalname).toLowerCase();
  try {
    let rawData: RecordType[] = [];

    switch (extension) {
      case '.csv':
        rawData = await csvRead(req.file.path);
        break;
      case '.xml':
        rawData = await xmlRead(req.file.path);
        break;
      default:
        return res.status(400).json({
          success: false,
          error: MESSAGES.unsupportedFile,
        });
    }

    const { valid, failed, correctData } = validateRecords(rawData);

    return res.status(200).json({
      success: true,
      totalRecords: rawData.length,
      validCount: valid.length,
      failedCount: failed.length,
      failedRecords: failed,
      successfulRecords: correctData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: MESSAGES.internalError,
      details: error instanceof Error ? error.message : String(error),
    });
  }
};

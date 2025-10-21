import type { Request, Response } from 'express';
import { MESSAGES } from '../constant.ts';
import type { ErrorResponse } from '../type.ts';

interface CustomError extends Error {
  statusCode?: number;
  details?: string;
}

export const globalErrorHandler = (
  err: CustomError | Error,
  req: Request,
  res: Response<ErrorResponse>,
): Response<ErrorResponse> => {
  if (err instanceof Error) {
    const statusCode = (err as CustomError).statusCode || 500;
    const responseBody: ErrorResponse = {
      error: err.message,
      details: (err as CustomError).details ?? undefined,
    };

    if (err.message.includes(MESSAGES.fileTypeError)) {
      return res.status(400).json({ error: err.message });
    }

    if (err.message.includes(MESSAGES.fileTooLarge)) {
      return res.status(413).json({ error: MESSAGES.largeFile });
    }

    return res.status(statusCode).json(responseBody);
  }

  // Handle non-Error thrown values
  return res.status(500).json({
    error: MESSAGES.unexpectedError,
    details: typeof err === 'string' ? err : undefined,
  });
};

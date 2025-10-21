import multer from 'multer';
import path from 'path';
import type { Request, Express } from 'express';
import type { FileFilterCallback } from 'multer';
import { MESSAGES } from '../constant.ts';
import { generateUniqueFileName } from '../utils/fileNameGenerator.ts';

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'uploads/');
  },
  filename: (req, file, callback) => {
    const uniqueName = generateUniqueFileName();
    callback(null, uniqueName + '-' + file.originalname);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback,
) => {
  const extension = path.extname(file.originalname).toLowerCase();

  if (extension === '.csv' || extension === '.xml') {
    callback(null, true);
  } else {
    callback(new Error(MESSAGES.csvXmlFile));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export default upload;

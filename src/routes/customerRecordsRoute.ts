import express from 'express';
import upload from '../middlewares/fileUploadMiddleware.ts';
import { customerRecordsController } from '../controllers/customerRecordsController.ts';

const router = express.Router();

router.post('/file-upload', upload.single('file'), customerRecordsController);

export default router;

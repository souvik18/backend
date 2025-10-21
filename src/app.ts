import express from 'express';
import cors from 'cors';
import type { Application, Request, Response } from 'express';
import customerRecordsRoute from './routes/customerRecordsRoute.ts';
import { globalErrorHandler } from './middlewares/globalErrorHandler.ts';

const app: Application = express();

app.use(express.json());

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  }),
);

app.use('/api', customerRecordsRoute);

app.use(globalErrorHandler);

app.get('/', (_req: Request, res: Response) => {
  res.send('Health Route');
});

export default app;

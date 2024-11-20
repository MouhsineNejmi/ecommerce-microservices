import express, {
  Express,
  json,
  NextFunction,
  Request,
  Response,
} from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import {
  BadRequestError,
  currentUser,
  DatabaseConnectionError,
  errorHandler,
  NotFoundError,
  securityMiddleware,
} from '@elevatex/common';
import 'express-async-handler';

import listingsRoutes from './routes/listings.routes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3002;
const allowedOrigins = process.env.ALLOWED_ORIGINS;

app.use(json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins?.split(',') }));
app.set('trust proxy', 1);
app.use(securityMiddleware.securityHeaders);
app.use(securityMiddleware.rateLimiter);

app.use(currentUser);
app.use('/api/listings', listingsRoutes);

app.all('*', async (req: Request, res: Response) => {
  throw new NotFoundError('API Route Not Found.');
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

const start = async () => {
  if (!process.env.JWT_ACCESS_SECRET) {
    throw new BadRequestError('JWT_ACCESS_SECRET not defined');
  }

  if (!process.env.MONGO_URI) {
    throw new BadRequestError('MONGO_URI not defined');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('[listings-service]: Connected To MongoDB');
  } catch (error) {
    console.error(error);
    throw new DatabaseConnectionError();
  }

  app.listen(port, () => {
    console.log(
      `[listings-service]: Server is running at http://localhost:${port}`
    );
  });
};

start();

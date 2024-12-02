import { NextFunction, Request, Response } from 'express';
import express from 'express';
import { json } from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import userRoutes from './routes/user.routes';
import listingRoutes from './routes/listings.routes';
import reservationRoutes from './routes/reservations.routes';
import categoryRoutes from './routes/category.routes';
import amenityRoutes from './routes/amenity.routes';

import { securityMiddleware } from './middlewares/security.middleware';
import { errorHandler } from './middlewares/error-handler.middleware';
import {
  NotFoundError,
  BadRequestError,
  DatabaseConnectionError,
} from './errors';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const allowedOrigins = process.env.ALLOWED_ORIGINS;

app.use(json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins?.split(','), credentials: true }));
app.set('trust proxy', 1);
app.use(securityMiddleware.securityHeaders);
// app.use(securityMiddleware.rateLimiter);

app.use('/api/users', userRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/amenities', amenityRoutes);
app.use('/api/reservations', reservationRoutes);

app.all('*', async (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError('API Route Not Found.'));
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

const start = async () => {
  if (!process.env.JWT_ACCESS_TOKEN_SECRET) {
    throw new BadRequestError('JWT_ACCESS_TOKEN_SECRET not defined');
  }

  if (!process.env.JWT_REFRESH_TOKEN_SECRET) {
    throw new BadRequestError('JWT_REFRESH_TOKEN_SECRET not defined');
  }

  if (!process.env.MONGO_URI) {
    throw new BadRequestError('MONGO_URI not defined');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI as string);

    console.log('[server]: Connected To MongoDB');
  } catch (error) {
    console.error(error);
    throw new DatabaseConnectionError();
  }

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
};

start();

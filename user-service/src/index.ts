import express, {
  Express,
  json,
  NextFunction,
  Request,
  Response,
} from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'express-async-errors';

import userRoutes from './routes/user.routes';

import { NotFoundError } from './errors/not-found.error';
import { BadRequestError } from './errors/bad-request.error';
import { DatabaseConnectionError } from './errors/database-connection.error';
import { errorHandler } from './middlewares/error-handler.middleware';
import { securityMiddleware } from './middlewares/security.middleware';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;
const allowedOrigins = process.env.ALLOWED_ORIGINS;

app.use(json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins?.split(',') }));
app.set('trust proxy', 1);
app.use(securityMiddleware.securityHeaders);
app.use(securityMiddleware.rateLimiter);

app.use('/api/users', userRoutes);

app.all('*', async (req, res) => {
  throw new NotFoundError('API Route Not Found.');
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

const start = async () => {
  if (!process.env.JWT_ACCESS_SECRET) {
    throw new BadRequestError('JWT_ACCESS_SECRET not defined');
  }

  if (!process.env.JWT_REFRESH_SECRET) {
    throw new BadRequestError('JWT_ACCESS_SECRET not defined');
  }

  if (!process.env.MONGO_URI) {
    throw new BadRequestError('MONGO_URI not defined');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI as string);

    console.log('[user-service]: Connected To MongoDB');
  } catch (error) {
    console.error(error);
    throw new DatabaseConnectionError();
  }

  app.listen(port, () => {
    console.log(
      `[user-service]: Server is running at http://localhost:${port}`
    );
  });
};

start();

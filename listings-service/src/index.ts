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
import 'express-async-handler';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3002;
const allowedOrigins = process.env.ALLOWED_ORIGINS;

app.use(json());
app.use(cors({ origin: allowedOrigins?.split(',') }));
app.set('trust proxy', 1);

app.get('/api/listings', (req: Request, res: Response) => {
  res.send('Listings Service');
});

app.all('*', async (req, res) => {
  // throw new NotFoundError('API Route Not Found.');
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // errorHandler(err, req, res, next);
});

const start = async () => {
  if (!process.env.MONGO_URI) {
    // throw new BadRequestError('MONGO_URI not defined');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI as string);

    console.log('[user-service]: Connected To MongoDB');
  } catch (error) {
    console.error(error);
    // throw new DatabaseConnectionError();
  }

  app.listen(port, () => {
    console.log(
      `[listings-service]: Server is running at http://localhost:${port}`
    );
  });
};

start();

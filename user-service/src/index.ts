import express, { Express, json, Request, Response } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

app.use(json());

app.get('/api/users', (req: Request, res: Response) => {
  res.send('User Service');
});

const start = async () => {
  try {
    await mongoose.connect('mongodb://user-mongo-srv:27017/users');
    console.log('[user-service]: Connected To MongoDB');
  } catch (error) {
    console.error(error);
  }

  app.listen(port, () => {
    console.log(
      `[user-service]: Server is running at http://localhost:${port}`
    );
  });
};

start();

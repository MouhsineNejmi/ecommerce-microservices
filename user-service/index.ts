import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

app.get('/api/users', (req: Request, res: Response) => {
  res.send('User Service');
});

app.listen(port, () => {
  console.log(`[user-service]: Server is running at http://localhost:${port}`);
});

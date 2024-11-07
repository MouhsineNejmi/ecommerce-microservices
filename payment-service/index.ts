import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3005;

app.get('/api/payments', (req: Request, res: Response) => {
  res.send('Payment Service');
});

app.listen(port, () => {
  console.log(
    `[payment-service]: Server is running at http://localhost:${port}`
  );
});

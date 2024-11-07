import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3004;

app.get('/api/orders', (req: Request, res: Response) => {
  res.send('Order Service');
});

app.listen(port, () => {
  console.log(`[order-service]: Server is running at http://localhost:${port}`);
});

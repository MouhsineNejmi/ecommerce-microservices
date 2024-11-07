import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3002;

app.get('/api/products', (req: Request, res: Response) => {
  res.send('Product Service');
});

app.listen(port, () => {
  console.log(
    `[product-service]: Server is running at http://localhost:${port}`
  );
});

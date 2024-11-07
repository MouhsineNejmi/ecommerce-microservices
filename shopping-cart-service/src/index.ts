import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3003;

app.get('/api/cart', (req: Request, res: Response) => {
  res.send('Shopping Cart Service');
});

app.listen(port, () => {
  console.log(
    `[shopping-cart-service]: Server is running at http://localhost:${port}`
  );
});

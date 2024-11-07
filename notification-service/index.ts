import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3006;

app.get('/api/notifications', (req: Request, res: Response) => {
  res.send('Notification Service');
});

app.listen(port, () => {
  console.log(
    `[notification-service]: Server is running at http://localhost:${port}`
  );
});

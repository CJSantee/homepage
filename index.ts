import express, { Express, Request, Response } from 'express';
import path from 'path';

const app: Express = express();
const port = 8080;

app.use(express.static(path.join(process.cwd(), "client", "build")));

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(process.cwd(), "client", "build", "index.html"));
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
// nothing
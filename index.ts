require('dotenv').config();
import express, { Express, Request, Response } from 'express';
import path from 'path';

const db = require('./db');

const app: Express = express();
const port = 8080;

app.use(express.static(path.join(process.cwd(), "client", "build")));

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(process.cwd(), "client", "build", "index.html"));
});

app.get('/api', async (req: Request, res: Response) => {
  const {rows: [{now: time}]} = await db.query('SELECT NOW()');
  res.send(`current database time: ${time}`);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

async function migrate() {
  console.log('Running migration script');
  try {
    await db.upgrade();
  } catch(err) {
    console.log('error', err);
    await db.end();
    console.log('Shutting down with error.');
    process.exit(1);
  }
}

async function init() {
  await migrate();
}

/**
 * Shut down node app
 */
['SIGINT', 'SIGTERM'].forEach(signal => {
  process.on(signal, async () => {
    try {
      await db.end();
    } catch(err) {
      console.log('was there an error', err);
    } finally {
      process.exit(0);
    }
  });
});

init();
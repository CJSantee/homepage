require('dotenv').config();
import express, { type Express, type Request, type Response } from 'express';
import bodyParser from 'body-parser';

import  api from './api';
import path from 'path';

import db from './db';

const app: Express = express();
const port = 8080;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({limit: '5mb', extended: false}));
// parse application/json
app.use(bodyParser.json({limit: '5mb'}));

app.use(express.static(path.join(process.cwd(), "client", "build")));

app.use('/api', api);

app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(process.cwd(), "client", "build", "index.html"));
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
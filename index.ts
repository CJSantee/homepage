require('dotenv').config();
import express, { type Express, type Request, type Response } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path';

import  api from './api';
import db from './db';
import { errorHandler } from './middleware/error';
import { io, initSocket } from './core/sockets';

const {NODE_ENV, PORT} = process.env;
const isDevelopment = NODE_ENV === 'development';
const port = PORT || 8080;

const app: Express = express();
const server = createServer(app);
initSocket(server);
io.on('connect', (socket) => {
  socket.on('user:id', (user_id) => {
    if(user_id) {
      console.log(`Joining Room: user:${user_id}`);
      socket.join(`user:${user_id}`)
    } else {
      socket.rooms.forEach(room => {
        if(room.substring(0,5) === 'user:') {
          console.log(`Leaving Room: ${room}`);
          socket.leave(room);
        }
      });
    }
  });
  console.log('user connected');
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({limit: '5mb', extended: false}));
// parse application/json
app.use(bodyParser.json({limit: '5mb'}));
app.use(cookieParser());

app.use(express.static(path.join(process.cwd(), "client", "build")));

app.use(cors({
  credentials: true,
  origin: isDevelopment ? 'http://localhost:3000' : 'https://colinjsantee.com',
}));

app.use('/api', api);

app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(process.cwd(), "client", "build", "index.html"));
});

app.use(errorHandler);

server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

async function migrate() {
  console.log('Running migration script');
  try {
    await db.upgrade();
    await db.load();
  } catch(err) {
    console.log('error', err);
    if(isDevelopment) {
      console.log('REMEMBER: Start Postgres server!');
    }
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
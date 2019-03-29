import RedisService from "./RedisService";

require("express-async-errors");
import Server from './Server';
import DatabaseService from './DatabaseService';
import * as http from 'http';

async function start() {
  await DatabaseService.createConnection();
  await RedisService.createClient();
  const server = new Server();
  const app = http.createServer(server.express);
  const port = process.env.PORT || 3030;
  // Listen to port
  app.listen(port);
  app.on('error', onError.bind(this));
  app.on('listening', onListening.bind(this));

  function onError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== 'listen') throw error;
    switch (error.code) {
      case 'EACCES':
        console.error(`${port} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(`${port} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  function onListening(): void {
    console.log(`Listening on ${port}`);
  }
}

start().then();

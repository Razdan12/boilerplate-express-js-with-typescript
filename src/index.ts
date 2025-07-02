
import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import httpStatus from 'http-status-codes';
import http from 'http';
import { Server as IOServer, Socket } from 'socket.io';
import router from './routes';
import handleError from './exceptions/handler.exception';

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;

app.disable('x-powered-by');

app.use(cors({ origin: '*', methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTION', credentials: true }));

app.use(bodyParser.json({ limit: '50mb', type: ['application/json', 'application/vnd.api+json'] }));
app.use(bodyParser.urlencoded({ limit: '50mb', parameterLimit: 50000, extended: true }));
app.use(bodyParser.raw({ type: ['application/json', 'application/vnd.api+json'] }));
app.use(bodyParser.text({ type: 'text/html' }));

const server = http.createServer(app);

// Routes
app.use('/api/v1', router); // Use your API routes under the /api/v1 prefix

// 404 Not Found Handler
// This middleware catches any requests that don't match previous routes
app.use((req: Request, res: Response, next: NextFunction) => {
  const statusCode = httpStatus.NOT_FOUND; // Get 404 status code

  res.status(statusCode).json({
    errors: {
      status: statusCode,
      data: null,
      error: {
        code: statusCode,
        message: 'ENDPOINT_NOTFOUND', // Custom error message
      },
    },
  });
});

server.listen(port, () => {
  console.log(`Server berjalan pada port ${port}`); // Ensure the exact port is logged
});

(BigInt.prototype as any).toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};

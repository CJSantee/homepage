// Reference https://expressjs.com/en/guide/error-handling.html
import { ApplicationError } from "../lib/applicationError";

export function errorHandler (err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  if(err instanceof ApplicationError && err.statusCode) {
    console.error(err.message);
    res.status(err.statusCode).send(err.statusMessage);
    return;
  }
  console.error(err.stack);
  res.status(500).send('An unexpected error occurred.');
}

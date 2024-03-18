// Reference https://expressjs.com/en/guide/error-handling.html
import { ApplicationError } from "../lib/applicationError";

export function errorHandler (err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  if(err instanceof ApplicationError && err.statusCode) {
    console.error('Error:', err.message);
    res.status(err.statusCode).json({error: {code: err.code, message: err.statusMessage}});
    return;
  }
  console.error(err.stack);
  res.status(500).json({error: {code: 'UNKNOWN_ERROR', message: 'An unexpected error occurred.'}});
}

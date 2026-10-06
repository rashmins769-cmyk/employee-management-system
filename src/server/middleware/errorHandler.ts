import { Request, Response, NextFunction } from 'express';

export interface ApiErrorResponse {
  success: boolean;
  error: string;
  details?: Record<string, string> | string[];
  statusCode?: number;
}

/**
 * Production-grade centralized error handler for Mongoose & Express errors
 */
export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('💥 [Server Error Caught]:', err.name, '-', err.message);

  let statusCode = res.statusCode !== 200 && res.statusCode !== 201 ? res.statusCode : 500;
  let errorMessage = err.message || 'Internal Server Error';
  let details: any = undefined;

  // Mongoose Validation Error (Schema field constraints, regex, enum)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    errorMessage = 'Validation Error: Please check required fields and formats.';
    const fieldErrors: Record<string, string> = {};

    if (err.errors) {
      Object.keys(err.errors).forEach((key) => {
        fieldErrors[key] = err.errors[key].message;
      });
    }
    details = fieldErrors;
  }

  // Mongoose CastError (Invalid ObjectId format)
  if (err.name === 'CastError') {
    statusCode = 404;
    errorMessage = `Invalid resource identifier: '${err.value}' is not a valid ID.`;
  }

  // MongoDB Duplicate Key Error (Unique email index)
  if (err.code === 11000 || err.message?.includes('E11000 duplicate key')) {
    statusCode = 400;
    const field = Object.keys(err.keyPattern || { email: 1 })[0] || 'email';
    errorMessage = `An employee with this ${field} already exists in the system.`;
    details = { [field]: `Duplicate value detected.` };
  }

  // Bad JSON syntax in request body
  if (err instanceof SyntaxError && 'body' in err) {
    statusCode = 400;
    errorMessage = 'Malformed JSON payload provided in request body.';
  }

  res.status(statusCode).json({
    success: false,
    error: errorMessage,
    details,
  });
}

import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import logger from '../utils/logger';

interface AppError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
  code?: number;
  keyValue?: Record<string, unknown>;
  errors?: Record<string, { message: string }>;
  path?: string;
  value?: string;
}

const handleCastErrorDB = (err: AppError): AppError => {
  const message = `Invalid ${err.path}: ${err.value}`;
  const error = new Error(message) as AppError;
  error.statusCode = 400;
  return error;
};

const handleDuplicateFieldsDB = (err: AppError): AppError => {
  const value = err.keyValue ? Object.values(err.keyValue)[0] : 'unknown';
  const message = `Duplicate field value: "${value}". Please use another value.`;
  const error = new Error(message) as AppError;
  error.statusCode = 400;
  return error;
};

const handleValidationErrorDB = (err: AppError): AppError => {
  const errors = Object.values(err.errors || {}).map((el) => el.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  const error = new Error(message) as AppError;
  error.statusCode = 400;
  return error;
};

const handleJWTError = (): AppError => {
  const error = new Error('Invalid token. Please log in again.') as AppError;
  error.statusCode = 401;
  return error;
};

const handleJWTExpiredError = (): AppError => {
  const error = new Error('Your token has expired. Please log in again.') as AppError;
  error.statusCode = 401;
  return error;
};

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  logger.error(`${err.statusCode} - ${err.message}`);

  let error = { ...err, message: err.message };

  if (err instanceof mongoose.Error.CastError) error = handleCastErrorDB(err);
  if (err.code === 11000) error = handleDuplicateFieldsDB(err);
  if (err instanceof mongoose.Error.ValidationError) error = handleValidationErrorDB(err);
  if (err.name === 'JsonWebTokenError') error = handleJWTError();
  if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

  if (process.env.NODE_ENV === 'development') {
    res.status(error.statusCode || 500).json({
      success: false,
      status: error.status,
      message: error.message,
      stack: err.stack,
      error: err,
    });
  } else {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode === 500 ? 'Something went wrong' : error.message,
    });
  }
};

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new Error(`Route not found: ${req.originalUrl}`) as AppError;
  error.statusCode = 404;
  next(error);
};

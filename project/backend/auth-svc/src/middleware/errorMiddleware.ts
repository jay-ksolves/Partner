import { Request, Response, NextFunction } from 'express';
import logger from '../../../common/logger';

export interface ApiError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`) as ApiError;
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (
  error: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = error.statusCode || 500;
  let message = error.message;

  // Mongoose bad ObjectId
  if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Resource not found';
  }

  // Mongoose duplicate key
  if (error.name === 'MongoServerError' && (error as any).code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered';
  }

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values((error as any).errors).map((val: any) => val.message).join(', ');
  }

  logger.error(`${error.message} - ${req.method} ${req.path} - ${req.ip}`, {
    error: error.stack,
    method: req.method,
    url: req.path,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};
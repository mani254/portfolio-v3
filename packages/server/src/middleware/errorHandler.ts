import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            message: err.message,
            stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
        });
    }

    // Default to 500 for unknown errors
    logger.error({
        err,
        request: {
            method: req.method,
            url: req.url,
            body: req.body,
        }
    }, `[Unhandled Error] ${err.name}: ${err.message}`);
    
    res.status(500).json({
        message: 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    });
};

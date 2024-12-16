import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import { AppError } from '../utils/types/compliance';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof AppError) {
        logger.error('Operational error:', {
            statusCode: err.statusCode,
            message: err.message,
            path: req.path
        });

        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message
        });
    }

    logger.error('Unexpected error:', {
        error: err,
        path: req.path
    });

    return res.status(500).json({
        status: 'error',
        message: 'Internal server error'
    });
};
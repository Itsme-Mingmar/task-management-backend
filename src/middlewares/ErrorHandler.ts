import {Request , Response, NextFunction} from 'express';
import { AppError } from '../utils/AppError';

export const errorHandler = (err: AppError | Error, req: Request, res: Response, next: NextFunction) => {
    console.error("Error:", err);
    let statusCode = 500;
    let message = "Internal Server Error";

    if(err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    } 

    res.status(statusCode)
        .json({ 
            success: false,
            Message: message 
        });
}

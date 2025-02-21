import { NextFunction, Request, Response } from "express";
import { config } from "../config/config";
import { HttpError } from "http-errors";

const globalErrorHandler = (err: HttpError, req: Request, res: Response, next: NextFunction): void => {
    const statusCode = err.statusCode || 500;
    console.log(config.env);
    
    // Send response without returning it
    res.status(statusCode).json({
        message: err.message,
        errorStack: config.env === "development" ? err.stack : ''
    });
};

export default globalErrorHandler;

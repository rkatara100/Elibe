import  { NextFunction, Request, Response }  from "express";
import { config } from "../config/config";
import  { HttpError } from "http-errors";

const globalErrorHandler= (err:HttpError,req:Request,res:Response,next:NextFunction):any=> {
      const statusCode = err.statusCode || 500;
      console.log(config.env);
      return res.status(statusCode).json({
        message: err.message,
        errorStack: config.env === "development" ? err.stack : ''
      });
      next();
    };

    export default globalErrorHandler;
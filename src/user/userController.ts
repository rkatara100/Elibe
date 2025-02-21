import  { NextFunction, Request, Response }  from "express";
import createHttpError from "http-errors";

const createUser=(req:Request,res:Response,next:NextFunction)=>{

          //validation 
           const {name,email,password}=req.body;
           if(!name ||!email || !password)
            {
                  const error=createHttpError(400,'All fields are required');
                  return next(error);
            } 

          //process
          //response send krte hai

          res.json({message:"user created"});
};



export  {createUser};
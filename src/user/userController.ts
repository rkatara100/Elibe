import  { NextFunction, Request, Response }  from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from 'bcrypt';

const createUser=async(req:Request,res:Response,next:NextFunction)=>{

          //validation 
           const {name,email,password}=req.body;
           if(!name ||!email || !password)
            {
                  const error=createHttpError(400,'All fields are required');
                  return next(error);
            } 

          
          //db call and check
            const user=await userModel.find({email});
            if(user){
                  const error=createHttpError(400,'User Email already exists');
                  return next(error);
            }
             
           
            const hashedPassword=await bcrypt.hash(password,10);
            


          //process
          //response send krte hai

          res.json({message:"user created"});
};



export  {createUser};
import  { NextFunction, Request, Response }  from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from 'bcrypt';
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "./userTypes";

const createUser=async(req:Request,res:Response,next:NextFunction)=>{

          //validation 
           const {name,email,password}=req.body;

           if(!name ||!email || !password)
            {
                  const error=createHttpError(400,'All fields are required');
                  return next(error);
            } 

           
          //db call and check
          try{

            const user=await userModel.findOne({email});
            if(user){
                  const error=createHttpError(400,'User Email already exists');
                  return next(error);
            }
             
      }catch(err)
      {
            return next(createHttpError(500,'Error while getting user'));
      }   


      const hashedPassword=await bcrypt.hash(password,10);
       
       let newUser:User;

            try{

            newUser= await userModel.create({
                  name,
                  email,
                  password:hashedPassword
            });
      }catch(err){
            return next(createHttpError(500,'error while creating user'));
      }
             try{
            //token generation  (payload)
            const token=sign({sub:newUser._id},config.jwtSecret as string,{expiresIn:"7d"});
            console.log(token);

          //response send krte hai

          res.json({Acess_token:token});
             }catch(err){
                  return next(createHttpError(500,'error while signing jwt token'));
             }
};



export  {createUser};
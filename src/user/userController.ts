import  { NextFunction, Request, Response }  from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from 'bcrypt';
import { sign, verify } from "jsonwebtoken";
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

          res.status(201).json({Acess_token:token});
             }catch(err){
                  return next(createHttpError(500,'error while signing jwt token'));
             }
};

const loginUser=async(req:Request,res:Response,next:NextFunction)=>{


      const {email,password}=req.body;
      if(!email ||!password){
            return next(createHttpError(400,'All fields are required'));
      }
  

        const user=await userModel.findOne({email});
        if(!user){
            return next(createHttpError(500,'User not found'));
       }
      
       const isMatch=await bcrypt.compare(password,user.password);

       if(!isMatch){
            return next(createHttpError(400,'Email or password incorrect!'));
       }

      const token=sign({sub:user._id},config.jwtSecret as string,{expiresIn:"7d"});


      res.json({Access_token:token}); 

};



export  {createUser,loginUser};
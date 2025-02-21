import mongoose from "mongoose";
import { User } from "./userTypes";

const userSchema=new mongoose.Schema<User>({
    name:{type:String,required:true},
    email:{type:String,unique:true,required:true},
    password:{type:String,required:true,length:8}

},{timestamps:true});

const userModel=mongoose.model('User',userSchema);

export default userModel;
import mongoose from "mongoose";
import { config } from "./config";

const connect=async()=>{
      try{

            mongoose.connection.on('connected',()=>{
                  console.log("connected to database");
            })
            mongoose.connection.on('error',(err)=>{
                  console.log("Error in connecting to database",err);
            })

      await mongoose.connect(config.database as string);
    
      }
      catch(err){
            console.log(err);
            process.exit(1);
      }
}
export default  connect;
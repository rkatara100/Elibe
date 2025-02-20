import express from "express";
const app=express();


app.get('/',(req,res,next)=>{
      res.json({hello:"235"});
      next();
})


export default app;

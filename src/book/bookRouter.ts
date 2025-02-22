import express from "express";
const bookRouter=express.Router();
// import {createUser,loginUser} from './bookController';

bookRouter.post('/register',createBook);
// userRouter.post('/login',loginUser);

export default userRouter;
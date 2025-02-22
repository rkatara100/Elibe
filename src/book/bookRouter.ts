import express from "express";
const bookRouter=express.Router();
import {createBook} from './bookController';

bookRouter.post('/create',createBook);

export default bookRouter;
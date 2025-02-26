import express from "express";
const bookRouter=express.Router();
import {createBook, updateBook} from './bookController';
import multer from "multer";
import path from "node:path";
import authenticate from "../middlewares/authenticate";

const upload=multer({
      dest:path.resolve(__dirname,'../../public/data/uploads'),
      limits:{fileSize:1.05e7}//~29MB
})

bookRouter.post('/create',authenticate,upload.fields([
     { name:'coverImage',maxCount:1},
     {name:'file',maxCount:1}

]),createBook);

bookRouter.put('/:bookId',authenticate,upload.fields([
      { name:'coverImage',maxCount:1},
      {name:'file',maxCount:1}
 
 ]),updateBook);
 
export default bookRouter;
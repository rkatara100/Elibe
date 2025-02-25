import { NextFunction, Request, Response } from "express";
import cloudinary from '../config/cloudinary';
import path from "node:path";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import fs from "node:fs";

const createBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, genre } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const coverImageMimeType = files.coverImage[0].mimetype.split('/').at(-1);
    const fileName = files.coverImage[0].filename;
    const filePath = path.resolve(__dirname, '../../public/data/uploads', fileName);

    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: "book-covers",
      format: coverImageMimeType
    });

    const bookFileName = files.file[0].filename;
    const bookFilePath = path.resolve(__dirname, '../../public/data/uploads', bookFileName);

    const bookFileUploadResult = await cloudinary.uploader.upload(bookFilePath, {
      resource_type: "raw",
      filename_override: bookFileName,
      folder: "book-pdfs",
      format: "pdf"
    });
      
    console.log("userid: ", (req as any).userId);

    const newBook = await bookModel.create({
      title,
      genre,
      author: "67b98c20b307b84e12d87c30",
      coverImage: uploadResult.secure_url,
      file: bookFileUploadResult.secure_url
    });
    
    try{
    await fs.promises.unlink(filePath).catch((err) => console.error("Error deleting cover image:", err));
    await fs.promises.unlink(bookFilePath).catch((err) => console.error("Error deleting book file:", err));
    }catch(err){
      console.log(err);
    }

    res.status(201).json({ id: newBook._id });

  } catch (error) {
    console.error(error);
    next(createHttpError(500, 'Error while uploading the file'));
  }
};

export { createBook };

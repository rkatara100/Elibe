import { NextFunction, Request, Response } from "express";
import cloudinary from '../config/cloudinary';
import path from "node:path";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import fs from "node:fs";
import { AuthRequest } from "../middlewares/authenticate";

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

    const _req = req as AuthRequest;

    const newBook = await bookModel.create({
      title,
      genre,
      author: _req.userId,
      coverImage: uploadResult.secure_url,
      file: bookFileUploadResult.secure_url
    });

    await fs.promises.unlink(filePath).catch((err) => console.error("Error deleting cover image:", err));
    await fs.promises.unlink(bookFilePath).catch((err) => console.error("Error deleting book file:", err));

    res.status(201).json({ id: newBook._id });

  } catch (error) {
    console.error(error);
    next(createHttpError(500, 'Error while uploading the file'));
  }
};

const updateBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, genre } = req.body;
    const bookId = req.params.bookId;

    const book = await bookModel.findOne({ _id: bookId });
    if (!book) {
      return next(createHttpError(404, 'Book not found'));
    }

    const _req = req as AuthRequest;

    if (book.author.toString() !== _req.userId) {
      return next(createHttpError(404, 'You cannot update others book'));
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    let completeCoverImage = "";

    if (files.coverImage) {
      const filename = files.coverImage[0].filename;
      const coverImageMimeType = files.coverImage[0].mimetype.split('/').at(-1);

      const filePath = path.resolve(__dirname, "../../public/data/uploads", filename);

      const uploadResult = await cloudinary.uploader.upload(filePath, {
        filename_override: filename,
        folder: "book-covers",
        format:coverImageMimeType
      });

      completeCoverImage = uploadResult.secure_url;

      await fs.promises.unlink(filePath);
    }

    let completeFileName = "";
    if (files.file) {
      const bookFilePath = path.resolve(__dirname, "../../public/data/uploads", files.file[0].filename);

      const bookFileName = files.file[0].filename;
      completeFileName = `${bookFileName}.pdf`;

      const uploadResultPdf = await cloudinary.uploader.upload(bookFilePath, {
        resource_type: "raw",
        filename_override: completeFileName,
        folder: "book-covers",
        format:"pdf"
      });

      completeFileName = uploadResultPdf.secure_url;
      await fs.promises.unlink(bookFilePath);
    }

    const updatedBook = await bookModel.findOneAndUpdate(
      { _id: bookId },
      {
        title: title,
        genre: genre,
        coverImage: completeCoverImage || book.coverImage,
        file: completeFileName || book.file,
      },
      { new: true }
    );

    res.json(updatedBook);

  } catch (error) {
    console.error(error);
    next(createHttpError(500, 'Error while updating the book'));
  }
};

export { createBook, updateBook };

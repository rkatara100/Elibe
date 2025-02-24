import { config as conf } from "dotenv";
conf();

const _config={
      port:process.env.PORT,
      database:process.env.MONGO_DB_URI,
      env:process.env.NODE_ENV,
      jwtSecret:process.env.JWT_SECRET,
      cloudinary_Cloud:process.env.CLOUDINARY_CLOUD,
      cloudinaryApikey:process.env.CLOUDINARY_API_KEY,
      cloudinarySecret:process.env.CLOUDINARY_SECRET
}

export const config=Object.freeze(_config);//read only 
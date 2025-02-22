import { config as conf } from "dotenv";
conf();

const _config={
      port:process.env.PORT,
      database:process.env.MONGO_DB_URI,
      env:process.env.NODE_ENV,
      jwtSecret:process.env.JWT_SECRET
}

export const config=Object.freeze(_config);//read only 
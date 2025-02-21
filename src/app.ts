import express from "express";
import globalErrorHandler from "./middlewares/globalerrorHandler";
const app = express();

app.get('/', (req, res) => {
  
    res.json({message:"Something wentv wrong"});

});

// Explicitly declare it as an error-handling middleware
app.use(globalErrorHandler);

export default app;

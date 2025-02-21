import express from "express";
import globalErrorHandler from "./middlewares/globalerrorHandler";
import userRouter from "./user/userRouter";
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.json({message:"Something went wrong"});
});


app.use('/api/users',userRouter); 

// Explicitly declare it as an error-handling middleware
app.use(globalErrorHandler);

export default app;

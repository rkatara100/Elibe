import express from "express";
import globalErrorHandler from "./middlewares/globalerrorHandler";
import userRouter from "./user/userRouter";
import bookRouter from "./book/bookrouter";
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.json({message:"Something went wrong"});
});


app.use('/api/users',userRouter); 
app.use('/api/books',bookRouter);
// Explicitly declare it as an error-handling middleware
app.use(globalErrorHandler);

export default app;

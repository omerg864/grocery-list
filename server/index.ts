import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import mongoSanitize from 'express-mongo-sanitize';
import errorHandler from "./middleware/errorMiddleware";
import rateLimiterMiddleware from './middleware/rateLimiterMiddleware';
import colors from "colors";
import cookieParser from 'cookie-parser';
import userRouter from './routes/userRoutes';

dotenv.config();

const port = process.env.PORT || 5000;

const app: Express = express();

connectDB();


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(mongoSanitize());
app.use(errorHandler);
app.use(rateLimiterMiddleware);
app.use(cookieParser());



app.listen(port, () => {
  console.log(colors.green.underline(`Server running on port ${port}`));
});

// Routes
app.use('/api/user', userRouter);

app.use(errorHandler);
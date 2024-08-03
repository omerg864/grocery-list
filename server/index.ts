import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import mongoSanitize from 'express-mongo-sanitize';
import errorHandler from './middleware/errorMiddleware';
import rateLimiterMiddleware from './middleware/rateLimiterMiddleware';
import colors from 'colors';
import cookieParser from 'cookie-parser';
import userRouter from './routes/userRoutes';
import itemRouter from './routes/itemRoutes';
import bundleRouter from './routes/bundleRoutes';
import listRouter from './routes/listRoutes';
import listItemRouter from './routes/listItemRoutes';
import cors from 'cors';

dotenv.config();

const port = process.env.PORT || 5000;

const app: Express = express();

connectDB();

console.log(process.env.HOST_ADDRESS);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(mongoSanitize());
app.use(errorHandler);
app.use(rateLimiterMiddleware);
app.use(cookieParser());
app.use(
	cors({
		origin: process.env.HOST_ADDRESS,
		credentials: true,
	})
);

app.listen(port, () => {
	console.log(colors.green.underline(`Server running on port ${port}`));
});

// Routes
app.use('/api/user', userRouter);
app.use('/api/item', itemRouter);
app.use('/api/bundle', bundleRouter);
app.use('/api/list', listRouter);
app.use('/api/listItem', listItemRouter);

app.use(errorHandler);

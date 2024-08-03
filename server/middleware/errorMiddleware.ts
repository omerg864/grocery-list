import { NextFunction, Request, Response } from 'express';

const errorHandler = async (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const statusCode = res.statusCode ? res.statusCode : 500;
	if (process.env.NODE_ENV === 'development') {
		console.log(err.stack);
	}
	res.status(statusCode).json({
		message: err.message,
		stack: process.env.NODE_ENV === 'production' ? '(:' : err.stack,
	});
};

export default errorHandler;

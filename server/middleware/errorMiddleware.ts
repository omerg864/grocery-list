import { NextFunction, Request, Response } from 'express';
import { unlinkAsync } from '../config/upload';

const errorHandler = async (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const statusCode = res.statusCode ? res.statusCode : 500;
	console.log(err.stack);
	if (req.file) {
		await unlinkAsync(req.file.path);
	}
	res.status(statusCode).json({
		message: err.message,
		stack: process.env.NODE_ENV === 'production' ? '(:' : err.stack,
	});
};

export default errorHandler;

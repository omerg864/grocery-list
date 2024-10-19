import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { password_regex, email_regex } from '../utils/regex';
import User from '../models/userModel';
import { Request, Response, NextFunction } from 'express';
import { userExclude } from '../utils/modelsConst';
import { sendEmail } from '../utils/functions';
import { RequestWithUser } from '../interface/requestInterface';
import { ObjectId } from 'mongoose';
import { UserDocument } from '../interface/userInterface';
import { uploadToCloudinary } from '../config/cloud';
import googleAuthClient from '../config/google';
import axios from 'axios';
import crypto from 'crypto';
import { v4 as uuid4 } from 'uuid';

const generateToken = (id: string) => {
	return jwt.sign({ id }, process.env.JWT_SECRET!, {
		expiresIn: '30d',
	});
};

const login = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const { email, password } = req.body;
		if (!email_regex.test(email)) {
			res.status(400);
			throw new Error('Invalid email');
		}
		if (!password_regex.test(password)) {
			res.status(400);
			throw new Error('Invalid password');
		}
		var user: UserDocument | null = await User.findOne({
			email: { $regex: new RegExp(`^${email}$`, 'i') },
		});
		if (!user) {
			res.status(400);
			throw new Error('Invalid email or password');
		}
		if (!user.isVerified) {
			res.status(400);
			throw new Error('Please verify your email');
		}
		const isMatch = await bcrypt.compare(password, user.password!);
		if (!isMatch) {
			res.status(400);
			throw new Error('Invalid email or password');
		}
		const token = generateToken(user._id as string);
		const userEx = await User.findById(user._id).select(userExclude);
		res.status(200).json({
			success: true,
			user: userEx,
			token,
		});
	}
);

const register = asyncHandler(async (req, res, next) => {
	const { f_name, l_name, email, password } = req.body;
	if (!f_name || !l_name || !email || !password) {
		res.status(400);
		throw new Error('Please fill all the fields');
	}
	if (!email_regex.test(email)) {
		res.status(400);
		throw new Error('Invalid email');
	}
	if (!password_regex.test(password)) {
		res.status(400);
		throw new Error('Invalid password');
	}
	const userExists = await User.findOne({
		email: { $regex: new RegExp(email, 'i') },
	});
	if (userExists) {
		res.status(400);
		throw new Error('User with that email already exists');
	}
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);
	const user: UserDocument = await User.create({
		f_name,
		l_name,
		email: email,
		password: hashedPassword,
	});
	let success;
	try {
		success = await sendEmail(
			user.email,
			'Verify your email',
			`Please verify your email by clicking on the link: ${process.env.HOST_ADDRESS}/verify/${user._id}`
		);
	} catch (err) {
		console.log(err);
		user.isVerified = true;
		await user.save();
	}
	if (!success) {
		user.isVerified = true;
		await user.save();
	}
	res.status(201).json({
		success: true,
	});
});

const getUser = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const userReq = (req as RequestWithUser).user;
		const user = await User.findById(userReq._id).select(userExclude);
		res.status(200).json({
			success: true,
			user,
			preferences: {
				fullSwipe: user!.fullSwipe,
				language: user!.language,
			},
		});
	}
);

const updateUser = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const { f_name, l_name, email } = req.body;
		if (!f_name || !l_name || !email) {
			res.status(400);
			throw new Error('Please fill all the fields');
		}
		if (!email_regex.test(email)) {
			res.status(400);
			throw new Error('Invalid email');
		}
		if (req.file && !req.file.mimetype.startsWith('image')) {
			res.status(400);
			throw new Error('Please upload an image file');
		}
		const userExists: UserDocument | null = await User.findOne({
			email: { $regex: new RegExp(email, 'i') },
		});
		const userReq = (req as RequestWithUser).user;
		if (
			userExists &&
			(userExists._id as ObjectId).toString() !==
				(userReq._id as ObjectId).toString()
		) {
			res.status(400);
			throw new Error('User with that email already exists');
		}
		if (req.file) {
			userReq!.avatar = await uploadToCloudinary(
				req.file.buffer,
				`${process.env.CLOUDINARY_BASE_FOLDER}/users`,
				`${userReq._id}/avatar`
			);
		}
		userReq!.f_name = f_name;
		userReq!.l_name = l_name;
		userReq!.email = email;
		await userReq!.save();
		const userEx = await User.findById(userReq._id).select(userExclude);
		res.status(200).json({
			success: true,
			user: userEx,
		});
	}
);

const updateUserPassword = asyncHandler(async (req, res, next) => {
	const { password } = req.body;
	const userReq = (req as RequestWithUser).user;
	if (!password) {
		res.status(400);
		throw new Error('Please fill all the fields');
	}
	if (!password_regex.test(password)) {
		res.status(400);
		throw new Error('Invalid password');
	}
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);
	userReq.password = hashedPassword;
	await userReq.save();
	res.status(200).json({
		success: true,
	});
});

const resetPasswordToken = asyncHandler(async (req, res, next) => {
	const { token } = req.params;
	const { password } = req.body;
	if (!token) {
		res.status(400);
		throw new Error('Invalid token');
	}
	const user: UserDocument | null = await User.findOne({
		resetPasswordToken: token,
	});
	if (!user) {
		res.status(400);
		throw new Error('Invalid token');
	}
	if (!password) {
		res.status(400);
		throw new Error('Please fill all the fields');
	}
	if (!password_regex.test(password)) {
		res.status(400);
		throw new Error('Invalid password');
	}
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);
	user.password = hashedPassword;
	user.resetPasswordToken = undefined;
	await user.save();
	res.status(200).json({
		success: true,
	});
});

const resetPasswordEmail = asyncHandler(async (req, res, next) => {
	const { email } = req.body;
	if (!email_regex.test(email)) {
		res.status(400);
		throw new Error('Invalid email');
	}
	const user = await User.findOne({
		email: { $regex: new RegExp(`^${email}$`, 'i') },
	});
	if (!user) {
		res.status(400);
		throw new Error('User not found');
	}
	let generatedToken = uuid4();
	user.resetPasswordToken = generatedToken;
	await user.save();
	let success;
	try {
		success = await sendEmail(
			user.email,
			'Reset your password',
			`Please reset your password by clicking on the link: ${process.env.HOST_ADDRESS}/reset-password/${generatedToken}`
		);
	} catch (err) {
		console.log('email error: ' + err);
		user.resetPasswordToken = undefined;
		await user.save();
		success = false;
	}
	if (!success) {
		user.resetPasswordToken = undefined;
		await user.save();
	}
	res.status(200).json({
		success,
	});
});

const verify = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const { id } = req.params;
		const user = await User.findById(id);
		if (!user) {
			res.status(400);
			throw new Error('User not found');
		}
		user.isVerified = true;
		await user.save();
		res.status(200).json({
			success: true,
			message: 'verified',
		});
	}
);

const resendVerificationEmail = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const { email } = req.body;
		if (!email_regex.test(email)) {
			res.status(400);
			throw new Error('Invalid email');
		}
		const user: UserDocument | null = await User.findOne({
			email: { $regex: new RegExp(`^${email}$`, 'i') },
		});
		if (!user) {
			res.status(400);
			throw new Error('User not found');
		}
		if (user.isVerified) {
			res.status(400);
			throw new Error('User is already verified');
		}
		let success;
		try {
			success = await sendEmail(
				user.email,
				'Verify your email',
				`Please verify your email by clicking on the link: ${process.env.HOST_ADDRESS}/verify/${user._id}`
			);
		} catch (err) {
			console.log(err);
			user.isVerified = true;
			await user.save();
		}
		if (!success) {
			user.isVerified = true;
			await user.save();
		}
		res.status(200).json({
			success: true,
		});
	}
);

const updatePreferences = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const { fullSwipe, language } = req.body;
		if (fullSwipe === undefined || language === undefined) {
			res.status(400);
			throw new Error('Please fill all the fields');
		}
		const userReq = (req as RequestWithUser).user;
		userReq.fullSwipe = fullSwipe;
		userReq.language = language;
		await userReq.save();
		const userEx = await User.findById(userReq._id).select(userExclude);
		res.status(200).json({
			success: true,
			user: userEx,
		});
	}
);

const googleAuth = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const { code } = req.body;
		if (!code) {
			res.status(400);
			throw new Error('Invalid code');
		}

		const googleRes = await googleAuthClient.getToken(code);

		googleAuthClient.setCredentials(googleRes.tokens);

		const userRes = await axios.get(
			`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
		);
		if (!userRes.data.email) {
			res.status(400);
			throw new Error('Invalid email');
		}
		const user = await User.findOne({
			email: { $regex: new RegExp(`^${userRes.data.email}$`, 'i') },
		});
		if (!user) {
			// Register user
			const salt = await bcrypt.genSalt(10);
			let generatedPassword = crypto.randomBytes(12).toString('hex');
			const hashedPassword = await bcrypt.hash(generatedPassword, salt);
			const newUser = await User.create({
				f_name: userRes.data.given_name,
				l_name: userRes.data.family_name || 'Doe',
				email: userRes.data.email,
				password: hashedPassword,
				avatar: userRes.data.picture,
				isVerified: true,
			});
			const token = generateToken(newUser._id as string);
			const userEx = await User.findById(newUser._id).select(userExclude);
			res.status(200).json({
				success: true,
				reset: true,
				user: userEx,
				token,
			});
		} else {
			// Login user
			if (!user.isVerified) {
				user.isVerified = true;
				await user.save();
			}
			const token = generateToken(user._id as string);
			const userEx = await User.findById(user._id).select(userExclude);
			res.status(200).json({
				success: true,
				user: userEx,
				token,
			});
		}
	}
);

export {
	login,
	verify,
	register,
	getUser,
	updateUserPassword,
	resetPasswordToken,
	resetPasswordEmail,
	updateUser,
	resendVerificationEmail,
	updatePreferences,
	googleAuth,
};

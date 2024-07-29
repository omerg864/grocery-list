import setRateLimit from 'express-rate-limit';

const rateLimiterMiddleware = setRateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 150, // limit each IP to 150 requests per windowMs
	headers: true,
});

export default rateLimiterMiddleware;

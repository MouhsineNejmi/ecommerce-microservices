import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

export const securityMiddleware = {
  rateLimiter: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 100, // limit each IP to 100 requests by windowMs
    message: 'Too many requests from this IP, please try again later.',
  }),

  loginLimiter: rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    message: 'Too many login attempts, please try again later.',
  }),

  securityHeaders: [
    helmet(),
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    }),
  ],
};

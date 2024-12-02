import dotenv from 'dotenv';
dotenv.config();

const config = {
  jwt: {
    accessToken: {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: '7d',
    },
    refreshToken: {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: '7d',
    },
  },
  security: {
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60,
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
  },
};

export default config;

import dotenv from 'dotenv';
dotenv.config();

const config = {
  jwt: {
    accessToken: {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    },
    refreshToken: {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    },
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
  security: {
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60,
  },
};

export default config;

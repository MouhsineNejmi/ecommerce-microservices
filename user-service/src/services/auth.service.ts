import { Request } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import config from '../config';
import { redis } from '../utils/redis';
import { JWTPayload } from '../types/jwt.types';
import { UserRole } from '../models/user';

export class AuthService {
  static generateTokens(userId: string, role: UserRole) {
    const accessToken = jwt.sign(
      { userId, role },
      config.jwt.accessToken.secret as string,
      {
        expiresIn: config.jwt.accessToken.expiresIn,
      }
    );

    const refreshToken = jwt.sign(
      { userId, role },
      config.jwt.refreshToken.secret as string,
      { expiresIn: config.jwt.refreshToken.expiresIn }
    );

    return { accessToken, refreshToken };
  }

  static async storeRefreshToken(userId: string, refreshToken: string) {
    try {
      const tokenHash = crypto
        .createHash('sha256')
        .update(refreshToken)
        .digest('hex');

      await redis.set(
        `refresh_token:${tokenHash}`,
        userId,
        'EX',
        7 * 24 * 60 * 60
      );
    } catch (error) {
      console.error('ERROR STORING TOKEN INSIDE REDIS: ', error);
    }
  }

  static async revokeRefreshToken(refreshToken: string) {
    const tokenHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    await redis.del(`refresh_token:${tokenHash}`);
  }

  static async validateRefreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(
        refreshToken,
        config.jwt.refreshToken.secret as string
      ) as JWTPayload;
      const tokenHash = crypto
        .createHash('sha256')
        .update(refreshToken)
        .digest('hex');

      const storedUserId = await redis.get(`refresh_token:${tokenHash}`);
      return storedUserId === decoded.userId ? decoded : null;
    } catch (error) {
      return null;
    }
  }

  static extractToken(req: Request) {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.split(' ')[1];
    }

    if (req.cookies && req.cookies.accessToken) {
      return req.cookies.accessToken;
    }

    return null;
  }
}

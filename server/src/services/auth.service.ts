import { Request } from 'express';
import jwt from 'jsonwebtoken';

import config from '../config';
import { JWTPayload } from '../types/jwt.types';
import { UserRole } from '../types/user.types';

export class AuthService {
  static generateTokens(id: string, role: UserRole) {
    const accessToken = jwt.sign(
      { id, role },
      config.jwt.accessToken.secret as string,
      {
        expiresIn: config.jwt.accessToken.expiresIn,
      }
    );

    const refreshToken = jwt.sign(
      { id, role },
      config.jwt.refreshToken.secret as string,
      { expiresIn: config.jwt.refreshToken.expiresIn }
    );

    return { accessToken, refreshToken };
  }

  static async validateRefreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(
        refreshToken,
        config.jwt.refreshToken.secret as string
      ) as JWTPayload;

      return decoded.id ? decoded : null;
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

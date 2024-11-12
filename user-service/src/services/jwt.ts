import jwt from 'jsonwebtoken';
import { BadRequestError } from '../errors/bad-request.error';

export const generateToken = (id: string): string | Error => {
  try {
    return jwt.sign({ id }, process.env.ELEVATEX_JWT_KEY as string, {
      expiresIn: '30d',
    }) as string;
  } catch (error) {
    throw new BadRequestError('Error creating token!');
  }
};

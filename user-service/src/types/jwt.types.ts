import { UserRole } from '../models/user';

export interface JWTPayload {
  userId: string;
  role: UserRole;
}

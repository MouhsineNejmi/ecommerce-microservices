import { UserRole } from './user.types';

export interface JWTPayload {
  id: string;
  role: UserRole;
}

import { UserRole } from '../models/user';

export interface JWTPayload {
  id: string;
  role: UserRole;
}

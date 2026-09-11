import { User } from '../../models/user.schema';

export const IUSER_REPOSITORY = 'IUSER_REPOSITORY';

export interface IUserRepository {
  create(userData: Partial<User>): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  update(id: string, updateData: Partial<User>): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}

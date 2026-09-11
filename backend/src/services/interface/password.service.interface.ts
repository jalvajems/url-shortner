export const IPASSWORD_SERVICE = 'IPASSWORD_SERVICE';

export interface IPasswordService {
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, hash: string): Promise<boolean>;
}

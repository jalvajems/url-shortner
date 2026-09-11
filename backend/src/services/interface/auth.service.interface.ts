import { AuthResponseDto, LoginDto, RegisterDto } from '../../dto/auth/auth.dto';

export const IAUTH_SERVICE = 'IAUTH_SERVICE';

export interface IAuthService {
  register(registerDto: RegisterDto): Promise<AuthResponseDto>;
  login(loginDto: LoginDto): Promise<AuthResponseDto>;
}

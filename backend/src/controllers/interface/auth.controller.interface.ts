import { AuthResponseDto, LoginDto, RegisterDto } from '../../dto/auth/auth.dto';

export interface IAuthController {
  register(registerDto: RegisterDto): Promise<AuthResponseDto>;
  login(loginDto: LoginDto): Promise<AuthResponseDto>;
  logout(): Promise<{ message: string }>;
}

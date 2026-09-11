import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthResponseDto, LoginDto, RegisterDto } from '../../dto/auth/auth.dto';
import { IUSER_REPOSITORY, IUserRepository } from '../../repositories/interface/user.repository.interface';
import { IAUTH_SERVICE, IAuthService } from '../interface/auth.service.interface';
import { IPASSWORD_SERVICE, IPasswordService } from '../interface/password.service.interface';
import { ITOKEN_SERVICE, ITokenService } from '../interface/token.service.interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(IUSER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(IPASSWORD_SERVICE)
    private readonly passwordService: IPasswordService,
    @Inject(ITOKEN_SERVICE)
    private readonly tokenService: ITokenService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { name, email, password } = registerDto;

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await this.passwordService.hashPassword(password);
    const createdUser = await this.userRepository.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    const payload = { sub: createdUser._id.toString(), email: createdUser.email };
    const accessToken = this.tokenService.generateAccessToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken(payload);

    return {
      user: {
        id: createdUser._id.toString(),
        name: createdUser.name,
        email: createdUser.email,
      },
      accessToken,
      refreshToken,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await this.passwordService.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { sub: user._id.toString(), email: user.email };
    const accessToken = this.tokenService.generateAccessToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken(payload);

    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
      accessToken,
      refreshToken,
    };
  }
}

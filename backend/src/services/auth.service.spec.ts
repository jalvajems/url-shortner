import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './implementation/auth.service';
import { IUserRepository } from '../repositories/interface/user.repository.interface';
import { IPasswordService } from './interface/password.service.interface';
import { ITokenService } from './interface/token.service.interface';

describe('AuthService', () => {
  let authService: AuthService;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockPasswordService: jest.Mocked<IPasswordService>;
  let mockTokenService: jest.Mocked<ITokenService>;

  beforeEach(() => {
    mockUserRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockPasswordService = {
      hashPassword: jest.fn(),
      comparePassword: jest.fn(),
    };

    mockTokenService = {
      generateAccessToken: jest.fn(),
      generateRefreshToken: jest.fn(),
      verifyAccessToken: jest.fn(),
      verifyRefreshToken: jest.fn(),
    };

    authService = new AuthService(
      mockUserRepository,
      mockPasswordService,
      mockTokenService,
    );
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const dto = { name: 'John Doe', email: 'john@example.com', password: 'Password123' };
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockPasswordService.hashPassword.mockResolvedValue('hashed_pw');
      mockUserRepository.create.mockResolvedValue({
        _id: 'user_123',
        name: dto.name,
        email: dto.email.toLowerCase(),
        password: 'hashed_pw',
      } as any);
      mockTokenService.generateAccessToken.mockReturnValue('access_token');
      mockTokenService.generateRefreshToken.mockReturnValue('refresh_token');

      const result = await authService.register(dto);

      expect(result.user.email).toBe(dto.email.toLowerCase());
      expect(result.accessToken).toBe('access_token');
      expect(mockPasswordService.hashPassword).toHaveBeenCalledWith(dto.password);
      expect(mockUserRepository.create).toHaveBeenCalled();
    });

    it('should throw ConflictException when email already exists', async () => {
      const dto = { name: 'John Doe', email: 'john@example.com', password: 'Password123' };
      mockUserRepository.findByEmail.mockResolvedValue({ _id: '1' } as any);

      await expect(authService.register(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should login successfully with correct credentials', async () => {
      const dto = { email: 'john@example.com', password: 'Password123' };
      mockUserRepository.findByEmail.mockResolvedValue({
        _id: 'user_123',
        name: 'John',
        email: dto.email,
        password: 'hashed_pw',
      } as any);
      mockPasswordService.comparePassword.mockResolvedValue(true);
      mockTokenService.generateAccessToken.mockReturnValue('access_token');
      mockTokenService.generateRefreshToken.mockReturnValue('refresh_token');

      const result = await authService.login(dto);

      expect(result.accessToken).toBe('access_token');
      expect(mockPasswordService.comparePassword).toHaveBeenCalledWith(
        dto.password,
        'hashed_pw',
      );
    });

    it('should throw UnauthorizedException when password does not match', async () => {
      const dto = { email: 'john@example.com', password: 'WrongPassword' };
      mockUserRepository.findByEmail.mockResolvedValue({
        _id: 'user_123',
        email: dto.email,
        password: 'hashed_pw',
      } as any);
      mockPasswordService.comparePassword.mockResolvedValue(false);

      await expect(authService.login(dto)).rejects.toThrow(UnauthorizedException);
    });
  });
});

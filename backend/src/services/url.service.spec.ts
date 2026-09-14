import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UrlService } from './implementation/url.service';
import { IUrlRepository } from '../repositories/interface/url.repository.interface';
import { IShortCodeGenerator } from '../utils/short-code-generator.interface';
import { ConfigService } from '@nestjs/config';

describe('UrlService', () => {
  let urlService: UrlService;
  let mockUrlRepository: jest.Mocked<IUrlRepository>;
  let mockShortCodeGenerator: jest.Mocked<IShortCodeGenerator>;
  let mockConfigService: jest.Mocked<ConfigService>;

  beforeEach(() => {
    mockUrlRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByShortCode: jest.fn(),
      findByUserId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      incrementClicks: jest.fn(),
    };

    mockShortCodeGenerator = {
      generate: jest.fn(),
    };

    mockConfigService = {
      get: jest.fn().mockReturnValue('http://localhost:4000'),
    } as any;

    urlService = new UrlService(
      mockUrlRepository,
      mockShortCodeGenerator,
      mockConfigService,
    );
  });

  describe('createShortUrl', () => {
    it('should create a shortened URL successfully', async () => {
      const userId = 'user_123';
      const dto = { originalUrl: 'https://example.com' };
      mockShortCodeGenerator.generate.mockReturnValue('a7K92x');
      mockUrlRepository.findByShortCode.mockResolvedValue(null);
      mockUrlRepository.create.mockResolvedValue({
        _id: 'url_123',
        originalUrl: dto.originalUrl,
        shortCode: 'a7K92x',
        shortUrl: 'http://localhost:4000/a7K92x',
        userId,
        clicks: 0,
        isActive: true,
        createdAt: new Date(),
      } as any);

      const result = await urlService.createShortUrl(userId, dto);

      expect(result.shortCode).toBe('a7K92x');
      expect(result.shortUrl).toBe('http://localhost:4000/a7K92x');
      expect(mockUrlRepository.create).toHaveBeenCalled();
    });

    it('should retry code generation on collision', async () => {
      const userId = 'user_123';
      const dto = { originalUrl: 'https://example.com' };

      // First code collides, second code is unique
      mockShortCodeGenerator.generate
        .mockReturnValueOnce('COLLID')
        .mockReturnValueOnce('UNIQUE');

      mockUrlRepository.findByShortCode
        .mockResolvedValueOnce({ _id: 'exist' } as any)
        .mockResolvedValueOnce(null);

      mockUrlRepository.create.mockResolvedValue({
        _id: 'url_123',
        originalUrl: dto.originalUrl,
        shortCode: 'UNIQUE',
        shortUrl: 'http://localhost:4000/UNIQUE',
        userId,
        clicks: 0,
        isActive: true,
        createdAt: new Date(),
      } as any);

      const result = await urlService.createShortUrl(userId, dto);

      expect(result.shortCode).toBe('UNIQUE');
      expect(mockShortCodeGenerator.generate).toHaveBeenCalledTimes(2);
    });
  });

  describe('getUrlById', () => {
    it('should throw ForbiddenException if user does not own the URL', async () => {
      const userId = 'user_owner';
      const wrongUserId = 'user_attacker';
      mockUrlRepository.findById.mockResolvedValue({
        _id: 'url_123',
        userId: userId,
      } as any);

      await expect(urlService.getUrlById(wrongUserId, 'url_123')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('getAndTrackOriginalUrl', () => {
    it('should return original URL and increment clicks', async () => {
      mockUrlRepository.findByShortCode.mockResolvedValue({
        _id: 'url_123',
        originalUrl: 'https://example.com',
        shortCode: 'a7K92x',
        isActive: true,
      } as any);

      const originalUrl = await urlService.getAndTrackOriginalUrl('a7K92x');

      expect(originalUrl).toBe('https://example.com');
      expect(mockUrlRepository.incrementClicks).toHaveBeenCalledWith('url_123');
    });

    it('should throw NotFoundException if short code is inactive or missing', async () => {
      mockUrlRepository.findByShortCode.mockResolvedValue(null);

      await expect(
        urlService.getAndTrackOriginalUrl('nonexistent'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});

import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateUrlDto, UrlResponseDto } from '../../dto/url/url.dto';
import { Url } from '../../models/url.schema';
import { IURL_REPOSITORY, IUrlRepository } from '../../repositories/interface/url.repository.interface';
import { ISHORT_CODE_GENERATOR, IShortCodeGenerator } from '../../utils/short-code-generator.interface';
import { IUrlService } from '../interface/url.service.interface';

@Injectable()
export class UrlService implements IUrlService {
  constructor(
    @Inject(IURL_REPOSITORY)
    private readonly urlRepository: IUrlRepository,
    @Inject(ISHORT_CODE_GENERATOR)
    private readonly shortCodeGenerator: IShortCodeGenerator,
    private readonly configService: ConfigService,
  ) {}

  async createShortUrl(userId: string, createUrlDto: CreateUrlDto): Promise<UrlResponseDto> {
    const { originalUrl } = createUrlDto;
    const baseUrl = this.configService.get<string>('BASE_URL', 'http://localhost:4000');

    // Generate unique short code with collision handling retry mechanism
    let shortCode = '';
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isUnique && attempts < maxAttempts) {
      shortCode = this.shortCodeGenerator.generate(6);
      const existing = await this.urlRepository.findByShortCode(shortCode);
      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      throw new InternalServerErrorException('Failed to generate a unique short code');
    }

    const shortUrl = `${baseUrl}/${shortCode}`;

    const created = await this.urlRepository.create({
      originalUrl,
      shortCode,
      shortUrl,
      userId,
      clicks: 0,
      isActive: true,
    });

    return this.mapToDto(created);
  }

  async getUserUrls(userId: string): Promise<UrlResponseDto[]> {
    const urls = await this.urlRepository.findByUserId(userId);
    return urls.map((url) => this.mapToDto(url));
  }

  async getUrlById(userId: string, id: string): Promise<UrlResponseDto> {
    const url = await this.urlRepository.findById(id);
    if (!url) {
      throw new NotFoundException('URL not found');
    }

    if (url.userId.toString() !== userId) {
      throw new ForbiddenException('You do not have access to this URL');
    }

    return this.mapToDto(url);
  }

  async deleteUrl(userId: string, id: string): Promise<boolean> {
    const url = await this.urlRepository.findById(id);
    if (!url) {
      throw new NotFoundException('URL not found');
    }

    if (url.userId.toString() !== userId) {
      throw new ForbiddenException('You do not have access to delete this URL');
    }

    return this.urlRepository.delete(id);
  }

  async getAndTrackOriginalUrl(shortCode: string): Promise<string> {
    const url = await this.urlRepository.findByShortCode(shortCode);

    if (!url || !url.isActive) {
      throw new NotFoundException('Short URL not found or inactive');
    }

    // Increment click count asynchronously
    await this.urlRepository.incrementClicks(url._id.toString());

    return url.originalUrl;
  }

  private mapToDto(url: Url): UrlResponseDto {
    return {
      id: url._id.toString(),
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      shortUrl: url.shortUrl,
      clicks: url.clicks,
      isActive: url.isActive,
      createdAt: url.createdAt,
    };
  }
}

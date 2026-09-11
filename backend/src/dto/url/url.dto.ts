import { IsNotEmpty, IsUrl } from 'class-validator';

export class CreateUrlDto {
  @IsNotEmpty({ message: 'Original URL is required' })
  @IsUrl({}, { message: 'Invalid URL format' })
  originalUrl: string;
}

export class UrlResponseDto {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  clicks: number;
  isActive: boolean;
  createdAt: Date;
}

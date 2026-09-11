import { CreateUrlDto, UrlResponseDto } from '../../dto/url/url.dto';
import { Url } from '../../models/url.schema';

export const IURL_SERVICE = 'IURL_SERVICE';

export interface IUrlService {
  createShortUrl(userId: string, createUrlDto: CreateUrlDto): Promise<UrlResponseDto>;
  getUserUrls(userId: string): Promise<UrlResponseDto[]>;
  getUrlById(userId: string, id: string): Promise<UrlResponseDto>;
  deleteUrl(userId: string, id: string): Promise<boolean>;
  getAndTrackOriginalUrl(shortCode: string): Promise<string>;
}

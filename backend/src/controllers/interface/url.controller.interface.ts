import { CreateUrlDto, UrlResponseDto } from '../../dto/url/url.dto';

export interface IUrlController {
  create(req: any, createUrlDto: CreateUrlDto): Promise<{ success: boolean; data: UrlResponseDto }>;
  findAll(req: any): Promise<{ success: boolean; data: UrlResponseDto[] }>;
  findOne(req: any, id: string): Promise<{ success: boolean; data: UrlResponseDto }>;
  remove(req: any, id: string): Promise<{ success: boolean; message: string }>;
  redirectToOriginal(shortCode: string, res: any): Promise<void>;
}

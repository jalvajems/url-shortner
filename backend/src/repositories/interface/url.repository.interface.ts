import { Url } from '../../models/url.schema';

export const IURL_REPOSITORY = 'IURL_REPOSITORY';

export interface IUrlRepository {
  create(urlData: Partial<Url>): Promise<Url>;
  findById(id: string): Promise<Url | null>;
  findByShortCode(shortCode: string): Promise<Url | null>;
  findByUserId(userId: string): Promise<Url[]>;
  update(id: string, updateData: Partial<Url>): Promise<Url | null>;
  delete(id: string): Promise<boolean>;
  incrementClicks(id: string): Promise<Url | null>;
}

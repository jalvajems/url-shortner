import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Url, UrlDocument } from '../../models/url.schema';
import { IUrlRepository } from '../interface/url.repository.interface';

@Injectable()
export class UrlRepository implements IUrlRepository {
  constructor(
    @InjectModel(Url.name) private readonly urlModel: Model<UrlDocument>,
  ) {}

  async create(urlData: Partial<Url>): Promise<Url> {
    const createdUrl = new this.urlModel(urlData);
    return createdUrl.save();
  }

  async findById(id: string): Promise<Url | null> {
    return this.urlModel.findById(id).exec();
  }

  async findByShortCode(shortCode: string): Promise<Url | null> {
    return this.urlModel.findOne({ shortCode }).exec();
  }

  async findByUserId(userId: string): Promise<Url[]> {
    return this.urlModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async update(id: string, updateData: Partial<Url>): Promise<Url | null> {
    return this.urlModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.urlModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async incrementClicks(id: string): Promise<Url | null> {
    return this.urlModel
      .findByIdAndUpdate(id, { $inc: { clicks: 1 } }, { new: true })
      .exec();
  }
}

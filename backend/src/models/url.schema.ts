import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type UrlDocument = Url & Document;

@Schema({ timestamps: true })
export class Url {
  _id?: string;

  @Prop({ required: true })
  originalUrl: string;

  @Prop({ required: true, unique: true, index: true })
  shortCode: string;

  @Prop({ required: true })
  shortUrl: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
  userId: string;

  @Prop({ default: 0 })
  clicks: number;

  @Prop({ default: true })
  isActive: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export const UrlSchema = SchemaFactory.createForClass(Url);

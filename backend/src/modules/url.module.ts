import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlController } from '../controllers/implementation/url.controller';
import { Url, UrlSchema } from '../models/url.schema';
import { UrlRepository } from '../repositories/implementation/url.repository';
import { IURL_REPOSITORY } from '../repositories/interface/url.repository.interface';
import { UrlService } from '../services/implementation/url.service';
import { IURL_SERVICE } from '../services/interface/url.service.interface';
import { ShortCodeGenerator } from '../utils/short-code-generator';
import { ISHORT_CODE_GENERATOR } from '../utils/short-code-generator.interface';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }]),
  ],
  controllers: [UrlController],
  providers: [
    {
      provide: IURL_REPOSITORY,
      useClass: UrlRepository,
    },
    {
      provide: ISHORT_CODE_GENERATOR,
      useClass: ShortCodeGenerator,
    },
    {
      provide: IURL_SERVICE,
      useClass: UrlService,
    },
  ],
  exports: [IURL_REPOSITORY, IURL_SERVICE],
})
export class UrlModule {}

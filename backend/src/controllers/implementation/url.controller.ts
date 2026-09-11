import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUrlDto, UrlResponseDto } from '../../dto/url/url.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { IURL_SERVICE, IUrlService } from '../../services/interface/url.service.interface';
import { IUrlController } from '../interface/url.controller.interface';

@ApiTags('URLs')
@Controller()
export class UrlController implements IUrlController {
  constructor(
    @Inject(IURL_SERVICE)
    private readonly urlService: IUrlService,
  ) {}

  @Post('api/urls')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a shortened URL' })
  @ApiResponse({ status: 201, description: 'URL created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Req() req: any,
    @Body() createUrlDto: CreateUrlDto,
  ): Promise<{ success: boolean; data: UrlResponseDto }> {
    const userId = req.user.userId;
    const data = await this.urlService.createShortUrl(userId, createUrlDto);
    return { success: true, data };
  }

  @Get('api/urls')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all URLs owned by authenticated user' })
  @ApiResponse({ status: 200, description: 'URLs retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Req() req: any): Promise<{ success: boolean; data: UrlResponseDto[] }> {
    const userId = req.user.userId;
    const data = await this.urlService.getUserUrls(userId);
    return { success: true, data };
  }

  @Get('api/urls/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get details of a specific URL owned by user' })
  @ApiResponse({ status: 200, description: 'URL details retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'URL not found' })
  async findOne(
    @Req() req: any,
    @Param('id') id: string,
  ): Promise<{ success: boolean; data: UrlResponseDto }> {
    const userId = req.user.userId;
    const data = await this.urlService.getUrlById(userId, id);
    return { success: true, data };
  }

  @Delete('api/urls/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a URL owned by user' })
  @ApiResponse({ status: 200, description: 'URL deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'URL not found' })
  async remove(
    @Req() req: any,
    @Param('id') id: string,
  ): Promise<{ success: boolean; message: string }> {
    const userId = req.user.userId;
    await this.urlService.deleteUrl(userId, id);
    return { success: true, message: 'URL deleted successfully' };
  }

  @Get(':shortCode')
  @HttpCode(HttpStatus.FOUND)
  @ApiOperation({ summary: 'Public endpoint to redirect to original URL' })
  @ApiResponse({ status: 302, description: 'Redirecting to original URL' })
  @ApiResponse({ status: 404, description: 'Short code not found' })
  async redirectToOriginal(
    @Param('shortCode') shortCode: string,
    @Res() res: any,
  ): Promise<void> {
    const originalUrl = await this.urlService.getAndTrackOriginalUrl(shortCode);
    return res.redirect(HttpStatus.FOUND, originalUrl);
  }
}

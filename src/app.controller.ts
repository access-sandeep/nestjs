import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AppService } from './app.service.js';
import { LoggerService } from './shared/logger/logger.service.js';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard.js';
import { RolesGuard } from './common/guards/roles.guard.js';
import { Roles } from './common/decorators/roles.decorator.js';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly logger: LoggerService,
  ) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(10)
  getHello(): string {
    this.logger.log('GET / called');
    return this.appService.getHello();
  }

  @Get('profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  profile(@Req() request: Request & { user?: { username: string; roles: string[] } }) {
    return request.user;
  }

  @Get('admin')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  adminOnly() {
    return { message: 'Admin content' };
  }

  @Get('error')
  triggerError(): never {
    throw new HttpException('Simulated exception', HttpStatus.BAD_REQUEST);
  }
}

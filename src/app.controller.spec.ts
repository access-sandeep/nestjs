import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import appConfig from './config/app.config.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { LoggerService } from './shared/logger/logger.service.js';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),
        CacheModule.register(),
        PassportModule.register({ defaultStrategy: 'jwt' }),
      ],
      controllers: [AppController],
      providers: [AppService, LoggerService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});

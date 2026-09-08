import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createLogger, format, transports, Logger } from 'winston';
import CloudWatchTransport from 'winston-cloudwatch';

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly logger: Logger;

  constructor(configService: ConfigService) {
    const loggerTransports = [new transports.Console()];
    const cloudWatch = configService.get<{
      logGroup?: string;
      logStream: string;
      region: string;
    }>('app.cloudWatch');

    if (cloudWatch?.logGroup) {
      loggerTransports.push(
        new CloudWatchTransport({
          logGroupName: cloudWatch.logGroup,
          logStreamName: cloudWatch.logStream,
          awsRegion: cloudWatch.region,
        }) as unknown as transports.ConsoleTransportInstance,
      );
    }

    this.logger = createLogger({
      format: format.combine(format.timestamp(), format.json()),
      transports: loggerTransports,
    });
  }

  log(message: string, context?: string): void {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string): void {
    this.logger.error(message, { context, trace });
  }

  warn(message: string, context?: string): void {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string): void {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string): void {
    this.logger.verbose(message, { context });
  }
}

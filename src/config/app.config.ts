import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: Number.parseInt(process.env.PORT ?? '3000', 10),
  jwtSecret: process.env.JWT_SECRET ?? 'dev-secret',
  cacheTtl: Number.parseInt(process.env.CACHE_TTL ?? '10', 10),
}));

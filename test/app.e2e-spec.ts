import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module.js';
import { HttpExceptionFilter } from './../src/common/filters/http-exception.filter.js';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect('Hello World!');
  });

  it('POST /auth/login validates input', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin' })
      .expect(400);
  });

  it('POST /auth/login returns JWT token for valid credentials', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin', password: 'admin123' })
      .expect(201);

    expect(response.body.access_token).toBeTypeOf('string');
  });

  it('GET /admin blocks non-admin users and allows admin', async () => {
    const userLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'john', password: 'john123' })
      .expect(201);

    await request(app.getHttpServer())
      .get('/admin')
      .set('Authorization', 'Bearer ' + userLogin.body.access_token)
      .expect(403);

    const adminLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin', password: 'admin123' })
      .expect(201);

    await request(app.getHttpServer())
      .get('/admin')
      .set('Authorization', 'Bearer ' + adminLogin.body.access_token)
      .expect(200)
      .expect({ message: 'Admin content' });
  });

  it('GET /error uses exception filter response shape', async () => {
    const response = await request(app.getHttpServer()).get('/error').expect(400);

    expect(response.body).toMatchObject({
      statusCode: 400,
      message: 'Simulated exception',
      path: '/error',
    });
    expect(response.body.timestamp).toBeTypeOf('string');
  });

  afterEach(async () => {
    await app.close();
  });
});

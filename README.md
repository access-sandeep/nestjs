# NestJS learning app

This sample app demonstrates:

1. Logging
2. Config files usage (`@nestjs/config`)
3. Authentication (JWT)
4. Authorization (role-based guard)
5. Swagger (`/docs`)
6. Caching (`CacheInterceptor` on `GET /`)
7. Exception handling (global exception filter)
8. Input validation (`ValidationPipe` + DTO validators)
9. Module import/export (`UsersModule` and `SharedModule` exports)

## Run

```bash
npm install
npm run start:dev
```

## Test users

- `admin` / `admin123` (roles: `admin`, `user`)
- `john` / `john123` (roles: `user`)

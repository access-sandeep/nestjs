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

## CloudWatch logging

The application always logs to the console. To also send logs directly to AWS CloudWatch Logs, set these environment variables in the deployment environment:

```bash
CLOUDWATCH_LOG_GROUP=/nestjs/app
CLOUDWATCH_LOG_STREAM=api
AWS_REGION=us-east-1
```

CloudWatch logging is enabled only when `CLOUDWATCH_LOG_GROUP` is set. The AWS SDK credential chain is used, so configure an IAM role for ECS, Lambda, or EC2 instead of putting access keys in the application. The role needs `logs:CreateLogStream` and `logs:PutLogEvents` for the configured log group. Create the log group and set its retention policy during infrastructure deployment.

For ECS or Fargate, forwarding container stdout/stderr with the `awslogs` log driver is also supported and is usually preferred over sending logs directly from the application.

## Test users

- `admin` / `admin123` (roles: `admin`, `user`)
- `john` / `john123` (roles: `user`)

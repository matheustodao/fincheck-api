import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { FincheckSwagger } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const swagger = new FincheckSwagger(SwaggerModule);

  swagger.setup(app);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

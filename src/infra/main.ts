import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvService } from './env/env.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import basicAuth from 'express-basic-auth';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from '../core/looger/logger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });
  app.enableCors({ origin: '*' });

  const envService = app.get(EnvService);

  app.use(
    ['/api', '/api-json'],
    basicAuth({
      challenge: true,
      users: {
        admin: '123456',
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('Power')
    .setVersion('0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = envService.get('PORT');

  await app.listen(port);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);

  app.useLogger(app.get(Logger));

  const configModule = app.get(ConfigService);

  await app.listen(configModule.getOrThrow('PORT'));
}
bootstrap();

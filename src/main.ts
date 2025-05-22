import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const rabbitUri = configService.get<string>('RABBITMQ_URI') ?? '';
  const queueA = configService.get<string>('RABBITMQ_QUEUE_A') ?? '';
  const queueB = configService.get<string>('RABBITMQ_QUEUE_B') ?? '';

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitUri],
      queue: queueA,
      queueOptions: {
        durable: true,
      },
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitUri],
      queue: queueB,
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000);
  console.log('Main app running on http://localhost:3000');
}
bootstrap();

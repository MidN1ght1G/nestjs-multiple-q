import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProducerService } from './producer.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'RABBITMQ_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URI')].filter(
              (url): url is string => !!url,
            ),
            queue: configService.get<string>('RABBITMQ_QUEUE'),
            queueOptions: { durable: false },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [ProducerService],
  exports: [ProducerService],
})
export class ProducerModule {}

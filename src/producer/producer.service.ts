import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  ClientProxyFactory,
  Transport,
  ClientProxy,
} from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProducerService implements OnModuleInit {
  private client: ClientProxy;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [this.configService.get('RABBITMQ_URL')],
        queue: this.configService.get('RABBITMQ_QUEUE'),
        queueOptions: { durable: false },
      },
    });

    // ทดสอบส่ง message ทุก 5 วินาที
    setInterval(() => {
      const msg = {
        message: 'Hello from producer',
        time: new Date().toISOString(),
      };
      console.log('Sending message:', msg);
      this.client.emit('test_queue', msg);
    }, 5000);
  }
}

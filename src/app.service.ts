import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class AppService implements OnModuleInit {
  private clientA: ClientProxy;
  private clientB: ClientProxy;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const rabbitmqUri = this.configService.get<string>('RABBITMQ_URI');

    this.clientA = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [rabbitmqUri],
        queue: this.configService.get<string>('RABBITMQ_QUEUE_A'),
        queueOptions: { durable: true },
      },
    } as any);

    this.clientB = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [rabbitmqUri],
        queue: this.configService.get<string>('RABBITMQ_QUEUE_B'),
        queueOptions: { durable: true },
      },
    } as any);
  }

  async sendToQueueA(data: any) {
    await this.clientA.emit('test_queue_a', data).toPromise();
    return { status: 'Message sent to queue A', data };
  }

  async sendToQueueB(data: any) {
    await this.clientB.emit('test_queue_b', data).toPromise();
    return { status: 'Message sent to queue B', data };
  }
}

import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProducerService implements OnModuleInit {
  private clientA;
  private clientB;

  constructor(private config: ConfigService) {}

  onModuleInit() {
    const uri = this.config.get('RABBITMQ_URI');
    this.clientA = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: { urls: [uri], queue: this.config.get('RABBITMQ_QUEUE_A') },
    });

    this.clientB = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: { urls: [uri], queue: this.config.get('RABBITMQ_QUEUE_B') },
    });

    this.sendTestMessages();
  }

  async sendTestMessages() {
    this.clientA.emit('test_queue_a', { msg: 'Message from Producer to A' });
    this.clientB.emit('test_queue_b', { msg: 'Message from Producer to B' });
  }
}

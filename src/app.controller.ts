import { Controller, Post, Body } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Controller()
export class AppController {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'test_queue',
        queueOptions: {
          durable: false,
        },
      },
    });
  }

  @Post('/publish')
  async publishMessage(@Body() body: { key: string; value: string }) {
    const result = await this.client.emit('test_queue', body).toPromise();

    console.log('Published to test_queue:', body);
    return {
      message: 'Published to test_queue',
      data: body,
    };
  }
}

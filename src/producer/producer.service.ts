import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ProducerService {
  constructor(
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
  ) {}

  async publish(data: Record<string, any>): Promise<void> {
    try {
      await this.client.emit('test_queue', data).toPromise();
      console.log('Published to test_queue:', data);
    } catch (error) {
      console.error('Failed to publish message:', error);
    }
  }
}

import { Injectable } from '@nestjs/common';
import { ProducerService } from './producer/producer.service';

@Injectable()
export class AppService {
  constructor(private readonly producerService: ProducerService) {}

  sendMessage(data: { key: string; value: string }) {
    return this.producerService.publish(data);
  }
}

import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { RedisService } from '../redis/redis.service';
import { Log, LogDocument } from '../mongo/data.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Controller()
export class ConsumerService {
  constructor(
    private redis: RedisService,
    @InjectModel(Log.name) private logModel: Model<LogDocument>,
  ) {}

  @EventPattern('test_queue_a')
  async handleTaskA(@Payload() data: any) {
    console.log('Received task_A:', data);
    await this.redis.set(`task_A:${Date.now()}`, JSON.stringify(data), 3600);
    await this.logModel.create({ queue: 'A', data });
  }

  @EventPattern('test_queue_b')
  async handleTaskB(@Payload() data: any) {
    console.log('Received task_B:', data);
    await this.redis.set(`task_B:${Date.now()}`, JSON.stringify(data), 3600);
    await this.logModel.create({ queue: 'B', data });
  }
}

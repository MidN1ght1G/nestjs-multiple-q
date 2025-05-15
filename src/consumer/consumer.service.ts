import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { RedisService } from '../redis/redis.service';
import { MongoService } from '../mongo/mongo.service';

@Controller()
export class ConsumerService {
  constructor(
    private readonly redisService: RedisService,
    private readonly mongoService: MongoService,
  ) {}

  @EventPattern('test_queue')
  async handleMessage(@Payload() data: { key: string; value: string }) {
    console.log('Received from queue:', data);

    await this.redisService.set(data.key, data.value, 3600);
    await this.mongoService.save(data);
  }
}

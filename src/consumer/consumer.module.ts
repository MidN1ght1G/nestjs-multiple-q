import { Module } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { RedisModule } from '../redis/redis.module';
import { MongoModule } from '../mongo/mongo.module';

@Module({
  controllers: [ConsumerService],
  imports: [RedisModule, MongoModule],
  providers: [ConsumerService],
})
export class ConsumerModule {}

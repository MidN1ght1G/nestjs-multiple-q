import { Module } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { RedisModule } from '../redis/redis.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Log, LogSchema } from '../mongo/data.schema';

@Module({
  controllers: [ConsumerService],
  imports: [
    RedisModule,
    MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }]),
  ],
  providers: [ConsumerService],
})
export class ConsumerModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProducerModule } from './producer/producer.module';
import { ConsumerModule } from './consumer/consumer.module';
import { RedisModule } from './redis/redis.module';
import { MongoModule } from './mongo/mongo.module';
import { ConsumerService } from './consumer/consumer.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ProducerModule,
    ConsumerModule,
    RedisModule,
    MongoModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConsumerService],
})
export class AppModule {}

import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProducerModule } from './producer/producer.module';
import { ConsumerModule } from './consumer/consumer.module';
import { RedisModule } from './redis/redis.module';
import { MongoModule } from './mongo/mongo.module';
import { LogSchema } from './mongo/data.schema';
import { FtpModule } from './ftp/ftp.module';
import { SftpModule } from './sftp/sftp.module';
import { RabbitmqModule } from './rabbitmq.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI') || '',
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: 'Log', schema: LogSchema }]),
    ProducerModule,
    ConsumerModule,
    RedisModule,
    MongoModule,
    FtpModule,
    SftpModule,
    RabbitmqModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

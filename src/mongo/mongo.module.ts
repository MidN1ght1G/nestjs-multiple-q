import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Log, LogSchema } from './data.schema';
import { MongoService } from './mongo.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }])],
  providers: [MongoService],
  exports: [MongoService],
})
export class MongoModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Data, DataSchema } from './data.schema';
import { MongoService } from './mongo.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Data.name, schema: DataSchema }]),
  ],
  providers: [MongoService],
  exports: [MongoService],
})
export class MongoModule {}

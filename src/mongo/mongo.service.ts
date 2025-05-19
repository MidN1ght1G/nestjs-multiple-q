import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log } from './data.schema';

@Injectable()
export class MongoService {
  constructor(@InjectModel(Log.name) private dataModel: Model<Log>) {}

  async save(data: { key: string; value: string }) {
    console.log('Saving to MongoDB:', data);
    const doc = new this.dataModel({
      key: data.key,
      value: data.value,
    });
    return doc.save();
  }

  async findAll() {
    return this.dataModel.find().exec();
  }

  async findByKey(key: string) {
    return this.dataModel.findOne({ key }).exec();
  }

  async clearAll() {
    return this.dataModel.deleteMany({}).exec();
  }
}

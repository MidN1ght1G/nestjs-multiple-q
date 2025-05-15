import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DataDoc } from './data.schema';

@Injectable()
export class MongoService {
  constructor(@InjectModel('Data') private dataModel: Model<DataDoc>) {}

  async save(data: { key: string; value: string }) {
    const doc = new this.dataModel(data);
    return doc.save();
  }
}

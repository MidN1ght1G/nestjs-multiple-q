import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class DataDoc extends Document {
  @Prop() key: string;
  @Prop() value: string;
}

export const DataSchema = SchemaFactory.createForClass(DataDoc);

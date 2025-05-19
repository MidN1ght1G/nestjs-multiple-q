import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';

@Schema({ timestamps: true })
export class Log {
  @Prop()
  queue: string;

  @Prop({ type: Object })
  data: any;
}

export type LogDocument = Log & Document;
export const LogSchema = SchemaFactory.createForClass(Log);
export type LogModel = Model<LogDocument>;

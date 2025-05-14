import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class MongoService {
  constructor(@InjectConnection() private readonly connection: Connection) {
    console.log('MongoDB service initialized');
  }

  /**
   * บันทึกข้อความลง MongoDB collection
   * @param message ข้อความที่ต้องการบันทึก
   */
  async saveMessage(message: any): Promise<any> {
    try {
      // สร้าง collection ชื่อ messages ถ้ายังไม่มี
      if (!this.connection.models.Message) {
        const messageSchema = new this.connection.Schema({
          content: String,
          timestamp: { type: Date, default: Date.now },
        });
        this.connection.model('Message', messageSchema);
      }
      const MessageModel = this.connection.models.Message;
      const newMessage = new MessageModel({
        content:
          typeof message === 'string' ? message : JSON.stringify(message),
      });
      return await newMessage.save();
    } catch (error) {
      console.error('Error saving message to MongoDB:', error);
      throw error;
    }
  }

  /**
   * ดึงข้อความทั้งหมดจาก collection
   */
  async getAllMessages(): Promise<any[]> {
    try {
      if (!this.connection.models.Message) {
        return [];
      }
      const MessageModel = this.connection.models.Message;
      return await MessageModel.find().sort({ timestamp: -1 }).exec();
    } catch (error) {
      console.error('Error fetching messages from MongoDB:', error);
      throw error;
    }
  }
}

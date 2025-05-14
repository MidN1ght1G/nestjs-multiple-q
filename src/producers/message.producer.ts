import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RedisService } from '../services/redis.service';

@Injectable()
export class MessageProducer {
  constructor(
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
    private readonly redisService: RedisService,
  ) {}

  /**
   * ส่งข้อความไปยัง RabbitMQ และบันทึกลง Redis พร้อมกัน
   * @param message ข้อความที่ต้องการส่ง
   * @param pattern รูปแบบข้อความ (หรือคีย์)
   */
  async sendMessage(
    message: any,
    pattern: string = 'message_pattern',
  ): Promise<any> {
    try {
      // ส่งข้อความไปยัง RabbitMQ
      this.client.emit<any>(pattern, message);
      console.log(`Message sent to RabbitMQ: ${JSON.stringify(message)}`);

      // บันทึกข้อความลง Redis ด้วย timestamp เป็น key
      const timestamp = Date.now().toString();
      const redisKey = `message:${timestamp}`;
      await this.redisService.set(redisKey, JSON.stringify(message));
      console.log(`Message stored in Redis with key: ${redisKey}`);

      return {
        success: true,
        message: 'Message sent and stored successfully',
        timestamp,
      };
    } catch (error) {
      console.error('Error in message producer:', error);
      throw error;
    }
  }
}

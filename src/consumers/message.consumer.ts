import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport, ClientRMQ } from '@nestjs/microservices';
import { MongoService } from '../services/mongo.service';
import { RedisService } from '../services/redis.service';

@Injectable()
export class MessageConsumer implements OnModuleInit {
  private client: ClientRMQ;

  constructor(
    private readonly configService: ConfigService,
    private readonly mongoService: MongoService,
    private readonly redisService: RedisService,
  ) {
    // สร้างการเชื่อมต่อ RabbitMQ client
    this.client = new ClientRMQ({
      urls: [this.configService.get<string>('RABBITMQ_URL')],
      queue: this.configService.get<string>('RABBITMQ_QUEUE'),
      queueOptions: {
        durable: true,
      },
    });
  }

  async onModuleInit() {
    // เชื่อมต่อกับ RabbitMQ เมื่อเริ่มต้นโมดูล
    await this.client.connect();

    // รับข้อความจาก RabbitMQ ด้วย pattern 'message_pattern'
    this.client
      .createSubscriber()
      .pipe()
      .subscribe({
        next: async (message: any) => {
          if (message?.pattern === 'message_pattern' && message?.data) {
            await this.handleMessage(message.data);
          }
        },
        error: (err) => {
          console.error('Error in message consumer:', err);
        },
      });

    console.log('Message consumer initialized and connected to RabbitMQ');
  }

  /**
   * จัดการกับข้อความที่ได้รับจาก RabbitMQ
   * @param message ข้อความที่ได้รับ
   */
  async handleMessage(message: any): Promise<void> {
    try {
      console.log(`Received message from RabbitMQ: ${JSON.stringify(message)}`);

      // บันทึกข้อความลง MongoDB
      await this.mongoService.saveMessage(message);
      console.log('Message saved to MongoDB');

      // บันทึกสถานะการประมวลผลลง Redis
      const timestamp = Date.now().toString();
      const processedKey = `processed:${timestamp}`;
      await this.redisService.set(
        processedKey,
        JSON.stringify({
          originalMessage: message,
          processed: true,
          processedAt: new Date().toISOString(),
        }),
      );
      console.log(
        `Processing status stored in Redis with key: ${processedKey}`,
      );
    } catch (error) {
      console.error('Error handling message:', error);
    }
  }
}

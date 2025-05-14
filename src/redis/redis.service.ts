import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name); // Logger ใช้ในการ log ข้อมูลต่างๆ
  private client: Redis; // ตัวแปรสำหรับเก็บ Redis client

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('REDIS_HOST');
    const port = this.configService.get<number>('REDIS_PORT');

    // สร้าง Redis client
    this.client = new Redis({
      host,
      port,
    });

    // event listener สำหรับการเชื่อมต่อ Redis
    this.client.on('connect', () => {
      this.logger.log('Connected to Redis'); // Log เมื่อเชื่อมต่อสำเร็จ
    });

    // event listener สำหรับ error
    this.client.on('error', (err) => {
      this.logger.error('Redis connection error:', err); // Log เมื่อเกิดข้อผิดพลาด
    });
  }

  // ฟังก์ชันเพื่อ set ค่าใน Redis
  async setValue(
    key: string,
    value: string,
    expireInSeconds?: number,
  ): Promise<void> {
    try {
      // ถ้ามี expireInSeconds ก็จะตั้งเวลาหมดอายุให้กับ key
      if (expireInSeconds) {
        await this.client.set(key, value, 'EX', expireInSeconds);
      } else {
        await this.client.set(key, value);
      }
      this.logger.log(`Key "${key}" set successfully.`); // Log เมื่อ set ค่าสำเร็จ
    } catch (err) {
      this.logger.error(`Error setting Redis key "${key}":`, err); // Log เมื่อเกิดข้อผิดพลาด
    }
  }

  // ฟังก์ชันเพื่อดึงค่าออกจาก Redis
  async getValue(key: string): Promise<string | null> {
    try {
      const value = await this.client.get(key);
      if (value) {
        this.logger.log(`Value for key "${key}" retrieved successfully.`); // Log เมื่อได้ค่าจาก Redis
        return value;
      }
      this.logger.warn(`Key "${key}" not found.`); // Log เมื่อไม่พบ key
      return null;
    } catch (err) {
      this.logger.error(`Error getting Redis key "${key}":`, err); // Log เมื่อเกิดข้อผิดพลาด
      return null;
    }
  }

  // ฟังก์ชันเพื่อ delete key ใน Redis
  async delValue(key: string): Promise<void> {
    try {
      await this.client.del(key);
      this.logger.log(`Key "${key}" deleted successfully.`); // Log เมื่อ key ถูกลบ
    } catch (err) {
      this.logger.error(`Error deleting Redis key "${key}":`, err); // Log เมื่อเกิดข้อผิดพลาด
    }
  }

  // เมื่อ module ถูกทำลาย (เช่น เมื่อแอปปิดการทำงาน)
  async onModuleDestroy() {
    await this.client.quit(); // ปิดการเชื่อมต่อ Redis
    this.logger.log('Redis connection closed.');
  }
}

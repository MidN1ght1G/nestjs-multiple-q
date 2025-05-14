import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly redisClient: Redis;

  constructor(private readonly configService: ConfigService) {
    // สร้างการเชื่อมต่อ Redis
    this.redisClient = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
    });

    // แสดงข้อความเมื่อเชื่อมต่อ Redis สำเร็จ
    this.redisClient.on('connect', () => {
      console.log('Successfully connected to Redis');
    });

    // แสดงข้อความเมื่อมีข้อผิดพลาดในการเชื่อมต่อ Redis
    this.redisClient.on('error', (err) => {
      console.error('Redis connection error:', err);
    });
  }

  /**
   * บันทึกข้อมูลใน Redis
   * @param key คีย์ที่ใช้ในการอ้างอิงข้อมูล
   * @param value ข้อมูลที่ต้องการบันทึก
   * @param ttl เวลาหมดอายุในหน่วยวินาที (ถ้าไม่กำหนดจะไม่มีการหมดอายุ)
   */
  async set(key: string, value: string, ttl?: number): Promise<'OK'> {
    if (ttl) {
      return this.redisClient.set(key, value, 'EX', ttl);
    }
    return this.redisClient.set(key, value);
  }

  /**
   * ดึงข้อมูลจาก Redis
   * @param key คีย์ที่ใช้ในการอ้างอิงข้อมูล
   * @returns ข้อมูลที่ค้นพบหรือ null ถ้าไม่พบข้อมูล
   */
  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  /**
   * ลบข้อมูลจาก Redis
   * @param key คีย์ที่ใช้ในการอ้างอิงข้อมูล
   */
  async delete(key: string): Promise<number> {
    return this.redisClient.del(key);
  }
}

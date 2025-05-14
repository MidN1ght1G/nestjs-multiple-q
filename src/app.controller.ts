import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { MessageProducer } from '../producers/message.producer';
import { RedisService } from '../services/redis.service';
import { MongoService } from '../services/mongo.service';

@Controller()
export class AppController {
  constructor(
    private readonly messageProducer: MessageProducer,
    private readonly redisService: RedisService,
    private readonly mongoService: MongoService,
  ) {}

  @Post('send-message')
  async sendMessage(@Body() messageDto: any) {
    return this.messageProducer.sendMessage(messageDto);
  }

  @Get('redis/:key')
  async getFromRedis(@Param('key') key: string) {
    const value = await this.redisService.get(key);
    return { key, value: value ? JSON.parse(value) : null };
  }

  @Get('messages')
  async getAllMessages() {
    return this.mongoService.getAllMessages();
  }

  @Get('health')
  healthCheck() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}

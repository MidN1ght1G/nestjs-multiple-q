import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // ส่งข้อความไป queue A
  @Post('send/a')
  async sendToQueueA(@Body() body: any) {
    return this.appService.sendToQueueA(body);
  }

  // ส่งข้อความไป queue B
  @Post('send/b')
  async sendToQueueB(@Body() body: any) {
    return this.appService.sendToQueueB(body);
  }
}

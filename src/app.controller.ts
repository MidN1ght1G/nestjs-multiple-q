import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('publish')
  publish(@Body() body: { key: string; value: string }) {
    return this.appService.sendMessage(body);
  }

  // Add this message handler
  @MessagePattern('test_queue')
  async handleMessage(data: any) {
    console.log('Received message from test_queue:', data);
    // Process the message here
    return { received: true };
  }
}

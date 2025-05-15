import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('publish')
  publish(@Body() body: { key: string; value: string }) {
    return this.appService.sendMessage(body);
  }
}

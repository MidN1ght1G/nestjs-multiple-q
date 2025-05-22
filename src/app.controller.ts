import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { RedisService } from './redis/redis.service';
import { MongoService } from './mongo/mongo.service';
import { FtpService } from './ftp/ftp.service';
import { SftpService } from './sftp/sftp.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
    private readonly redisService: RedisService,
    private readonly mongoService: MongoService,
    private readonly ftpService: FtpService,
    private readonly sftpService: SftpService,
  ) {}

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

  @Post('publish')
  async publishToQueue(@Body() body: { key: string; value: string }) {
    const message = { key: body.key, value: body.value };
    await this.client.emit(process.env.RABBITMQ_QUEUE_A, message).toPromise();
    return { status: 'Message published', message };
  }

  @Post('redis/set')
  async setRedis(@Body() body: { key: string; value: string }) {
    await this.redisService.set(body.key, body.value, 3600);
    return { status: 'Set in Redis', key: body.key };
  }

  @Get('redis/get')
  async getRedis(@Body() body: { key: string }) {
    const value = await this.redisService.get(body.key);
    return { key: body.key, value };
  }

  @Post('mongo/save')
  async saveMongo(@Body() body: { key: string; value: string }) {
    const result = await this.mongoService.save(body);
    return { status: 'Saved to MongoDB', result };
  }

  @Post('ftp/upload')
  async uploadToFtp(@Body() body: { local: string; remote: string }) {
    await this.ftpService.upload(body.local, body.remote);
    return { status: 'Uploaded to FTP' };
  }

  @Post('ftp/download')
  async downloadFromFtp(@Body() body: { remote: string; local: string }) {
    await this.ftpService.download(body.remote, body.local);
    return { status: 'Downloaded from FTP' };
  }

  @Post('ftp/meta')
  async getFtpMeta(@Body() body: { remote: string }) {
    const meta = await this.ftpService.getFileMetadata(body.remote);
    return { status: 'FTP Metadata', meta };
  }

  @Post('sftp/upload')
  async uploadToSftp(@Body() body: { local: string; remote: string }) {
    await this.sftpService.upload(body.local, body.remote);
    return { status: 'Uploaded to SFTP' };
  }

  @Post('sftp/download')
  async downloadFromSftp(@Body() body: { remote: string; local: string }) {
    await this.sftpService.download(body.remote, body.local);
    return { status: 'Downloaded from SFTP' };
  }

  @Post('sftp/meta')
  async getSftpMeta(@Body() body: { remote: string }) {
    const meta = await this.sftpService.getFileMetadata(body.remote);
    return { status: 'SFTP Metadata', meta };
  }
}

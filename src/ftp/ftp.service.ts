import { Injectable } from '@nestjs/common';
import { Client } from 'basic-ftp';

@Injectable()
export class FtpService {
  private client = new Client();

  async connect() {
    await this.client.access({
      host: process.env.FTP_HOST,
      port: parseInt(process.env.FTP_PORT ?? '21'),
      user: process.env.FTP_USER,
      password: process.env.FTP_PASS,
      secure: false,
    });
  }

  async upload(localPath: string, remotePath: string) {
    await this.connect();
    await this.client.uploadFrom(localPath, remotePath);
    await this.client.close();
  }

  async download(remotePath: string, localPath: string) {
    await this.connect();
    await this.client.downloadTo(localPath, remotePath);
    await this.client.close();
  }

  async getFileMetadata(remotePath: string) {
    await this.connect();
    const list = await this.client.list(remotePath);
    await this.client.close();
    return list;
  }
}

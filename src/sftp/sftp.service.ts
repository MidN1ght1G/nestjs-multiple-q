import { Injectable } from '@nestjs/common';
import * as SftpClient from 'ssh2-sftp-client';

@Injectable()
export class SftpService {
  private sftp = new SftpClient();

  async connect() {
    await this.sftp.connect({
      host: process.env.SFTP_HOST,
      port: parseInt(process.env.SFTP_PORT ?? '22'),
      username: process.env.SFTP_USER,
      password: process.env.SFTP_PASS,
    });
  }

  async upload(localPath: string, remotePath: string) {
    await this.connect();
    await this.sftp.put(localPath, remotePath);
    await this.sftp.end();
  }

  async download(remotePath: string, localPath: string) {
    await this.connect();
    await this.sftp.get(remotePath, localPath);
    await this.sftp.end();
  }

  async getFileMetadata(remotePath: string) {
    await this.connect();
    const stat = await this.sftp.stat(remotePath);
    await this.sftp.end();
    return stat;
  }
}

import crypto from 'crypto'
import dotenv from 'dotenv'
dotenv.config()

export class Encryption {
  private readonly key: Buffer = Buffer.from(process.env.HASH_KEY, 'hex');
  private readonly iv: Buffer = Buffer.from(process.env.HASH_IV, 'hex');

  cipher(data: any): string {


    const cipher = crypto.createCipheriv('aes-256-cbc', this.key, this.iv);

    let encryptedData = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encryptedData += cipher.final('hex');
    return encryptedData;

  }
  decipher(encryptedData: string): any {
    const decipher = crypto.createDecipheriv('aes-256-cbc', this.key, this.iv);

    let decryptedData = decipher.update(encryptedData, 'hex', 'utf8');
    decryptedData += decipher.final('utf8');
    return JSON.parse(decryptedData);
  };
}
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class Bcrypt {
  async hash(password: string, salt: number): Promise<string> {
    return await bcrypt.hash(password, salt);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}

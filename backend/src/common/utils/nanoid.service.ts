import { Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';

@Injectable()
export class NanoidService {
  generate(size = 16): string {
    return nanoid(size);
  }
}

import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { timingSafeEqual } from 'crypto';

/**
 * Guards admin-only endpoints with a static API key header.
 * The client must send: x-admin-key: <ADMIN_API_KEY>
 */
@Injectable()
export class AdminKeyGuard implements CanActivate {
  constructor(private config: ConfigService) {}

  canActivate(ctx: ExecutionContext): boolean {
    const request = ctx.switchToHttp().getRequest();
    const key = request.headers['x-admin-key'];
    const expected = this.config.get<string>('ADMIN_API_KEY');

    if (!expected) {
      throw new UnauthorizedException('Admin API key not configured on server');
    }
    if (!key || typeof key !== 'string') {
      throw new UnauthorizedException('Invalid admin API key');
    }

    const keyBuf = Buffer.from(key);
    const expectedBuf = Buffer.from(expected);

    if (keyBuf.length !== expectedBuf.length || !timingSafeEqual(keyBuf, expectedBuf)) {
      throw new UnauthorizedException('Invalid admin API key');
    }
    return true;
  }
}

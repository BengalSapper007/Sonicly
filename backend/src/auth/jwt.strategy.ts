import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

export type JwtPayload = {
  sub: string;
  email: string;
  username: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      /**
       * Extract JWT from:
       *  1. HTTP-only cookie (unsigned or signed) — primary path for browser clients
       *  2. Authorization: Bearer header — fallback for API / mobile clients / local dev
       */
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) =>
          request?.cookies?.['sonicly_token'] ??
          request?.signedCookies?.['sonicly_token'] ??
          null,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET', 'sonicly_jwt_secret_change_in_production'),
    });
  }

  async validate(payload: JwtPayload) {
    return {
      sub: payload.sub,   // used by every controller: user.sub
      id: payload.sub,    // keep for any legacy references
      email: payload.email,
      username: payload.username,
    };
  }
}


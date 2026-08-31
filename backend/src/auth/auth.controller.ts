import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

const COOKIE_NAME = 'sonicly_token';
const isProd = process.env.NODE_ENV === 'production';

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: isProd ? ('none' as const) : ('lax' as const),
  secure: isProd,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
};

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Throttle({ default: { ttl: 60_000, limit: 3 } }) // 3 registrations / min per IP
  @Post('register')
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: any) {
    const { token, user } = await this.authService.register(dto);
    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);
    return { success: true, user };
  }

  @Public()
  @Throttle({ default: { ttl: 60_000, limit: 5 } }) // 5 login attempts / min per IP
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: any) {
    const { token, user } = await this.authService.login(dto);
    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);
    return { success: true, user };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: any) {
    res.clearCookie(COOKIE_NAME, {
      path: '/',
      httpOnly: true,
      sameSite: isProd ? 'none' : 'lax',
      secure: isProd,
    });
    return { success: true, message: 'Logged out' };
  }

  @SkipThrottle() // called on every page load — no need to throttle
  @Get('me')
  async getMe(@CurrentUser() user: any) {
    const userData = await this.authService.getMe(user.sub);
    return { success: true, user: userData };
  }
}

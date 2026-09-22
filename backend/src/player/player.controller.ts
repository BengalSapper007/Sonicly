import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { PlayerService } from './player.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UpdatePlaybackStateDto } from './dto/update-playback.dto';

@Controller('player')
@UseGuards(JwtAuthGuard)
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get('state')
  getState(@CurrentUser() user: any) {
    return this.playerService.getState(user.sub);
  }

  @Throttle({ default: { ttl: 60_000, limit: 120 } }) // 120 / min to allow frequent playback state updates
  @Put('state')
  updateState(@Body() dto: UpdatePlaybackStateDto, @CurrentUser() user: any) {
    return this.playerService.updateState(user.sub, dto);
  }
}

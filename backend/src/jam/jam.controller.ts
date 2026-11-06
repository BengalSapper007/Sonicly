import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { JamService } from './jam.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateJamDto } from './dto/create-jam.dto';
import { UpdateJamDto } from './dto/update-jam.dto';
import { AddToJamQueueDto } from './dto/add-to-queue.dto';

@Controller('jam')
@UseGuards(JwtAuthGuard)
export class JamController {
  constructor(private readonly jamService: JamService) {}

  @Post()
  createJam(@CurrentUser() user: any, @Body() dto: CreateJamDto) {
    return this.jamService.createJam(user.sub, dto);
  }

  @Get(':code')
  getJam(@Param('code') code: string) {
    return this.jamService.getJamByCode(code.toUpperCase());
  }

  @Post(':code/join')
  joinJam(@CurrentUser() user: any, @Param('code') code: string) {
    return this.jamService.joinJam(user.sub, code.toUpperCase());
  }

  @Post(':code/leave')
  leaveJam(@CurrentUser() user: any, @Param('code') code: string) {
    return this.jamService.leaveJam(user.sub, code.toUpperCase());
  }

  @Patch(':code')
  updateJam(
    @CurrentUser() user: any,
    @Param('code') code: string,
    @Body() dto: UpdateJamDto,
  ) {
    return this.jamService.updateJam(user.sub, code.toUpperCase(), dto);
  }

  @Post(':code/queue')
  addToQueue(
    @CurrentUser() user: any,
    @Param('code') code: string,
    @Body() dto: AddToJamQueueDto,
  ) {
    return this.jamService.addToQueue(user.sub, code.toUpperCase(), dto.songId);
  }

  @Delete(':code/queue/:queueItemId')
  removeFromQueue(
    @CurrentUser() user: any,
    @Param('code') code: string,
    @Param('queueItemId') queueItemId: string,
  ) {
    return this.jamService.removeFromQueue(user.sub, code.toUpperCase(), queueItemId);
  }

  @Post(':code/next')
  popNextSong(@Param('code') code: string) {
    return this.jamService.popNextQueueSong(code.toUpperCase());
  }
}


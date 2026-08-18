import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { HistoryService } from './history.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { IsString } from 'class-validator';

class RecordPlayDto {
  @IsString()
  songId: string;
}

@Controller('history')
@UseGuards(JwtAuthGuard)
export class HistoryController {
  constructor(private historyService: HistoryService) {}

  @Get()
  getHistory(@CurrentUser() user: any) {
    return this.historyService.getHistory(user.sub);
  }

  @Post()
  recordPlay(@Body() dto: RecordPlayDto, @CurrentUser() user: any) {
    return this.historyService.recordPlay(user.sub, dto.songId);
  }
}

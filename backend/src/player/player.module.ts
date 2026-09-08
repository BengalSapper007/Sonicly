import { Module } from '@nestjs/common';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import { PlayerGatewayService } from './player-gateway.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [PlayerController],
  providers: [PlayerService, PlayerGatewayService],
  exports: [PlayerService, PlayerGatewayService],
})
export class PlayerModule {}

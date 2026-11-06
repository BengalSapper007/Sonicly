import { Module } from '@nestjs/common';
import { JamController } from './jam.controller';
import { JamService } from './jam.service';
import { JamGatewayService } from './jam-gateway.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [JamController],
  providers: [JamService, JamGatewayService],
  exports: [JamService, JamGatewayService],
})
export class JamModule {}


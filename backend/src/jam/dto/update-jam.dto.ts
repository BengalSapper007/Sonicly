import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateJamDto {
  @IsOptional()
  @IsBoolean()
  hostControlsOnly?: boolean;

  @IsOptional()
  @IsString()
  currentSongId?: string;

  @IsOptional()
  @IsNumber()
  currentPositionMs?: number;

  @IsOptional()
  @IsBoolean()
  isPlaying?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}


import { IsString, IsOptional, IsNumber, IsBoolean, IsArray } from 'class-validator';

export class UpdatePlaybackStateDto {
  @IsOptional()
  @IsString()
  songId?: string | null;

  @IsOptional()
  @IsNumber()
  currentTime?: number;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  @IsNumber()
  progress?: number;

  @IsOptional()
  @IsString()
  contextType?: string | null;

  @IsOptional()
  @IsString()
  contextId?: string | null;

  @IsOptional()
  @IsString()
  contextTitle?: string | null;

  @IsOptional()
  @IsNumber()
  currentIndex?: number;

  @IsOptional()
  @IsArray()
  queue?: any[];

  @IsOptional()
  @IsArray()
  userQueue?: any[];

  @IsOptional()
  @IsNumber()
  volume?: number;

  @IsOptional()
  @IsBoolean()
  shuffle?: boolean;

  @IsOptional()
  @IsString()
  repeat?: string;

  @IsOptional()
  @IsString()
  activeDeviceId?: string | null;
}

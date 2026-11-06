import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateJamDto {
  @IsOptional()
  @IsBoolean()
  hostControlsOnly?: boolean;

  @IsOptional()
  @IsString()
  initialSongId?: string;
}

import {
  IsString,
  IsOptional,
  IsArray,
  MinLength,
  MaxLength,
  ArrayMaxSize,
} from 'class-validator';

export class CreatePlaylistDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}

export class UpdatePlaylistDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}

export class AddSongDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  songId: string;
}

export class ReorderSongsDto {
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(500)
  songIds: string[];
}

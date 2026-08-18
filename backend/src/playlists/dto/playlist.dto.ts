import {
  IsString, IsOptional, IsArray, IsInt, Min,
} from 'class-validator';

export class CreatePlaylistDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdatePlaylistDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class AddSongDto {
  @IsString()
  songId: string;
}

export class ReorderSongsDto {
  @IsArray()
  songIds: string[];
}

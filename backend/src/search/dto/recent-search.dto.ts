import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum SearchHistoryType {
  QUERY = 'QUERY',
  SONG = 'SONG',
  ARTIST = 'ARTIST',
  ALBUM = 'ALBUM',
  PLAYLIST = 'PLAYLIST',
}

export class RecordRecentSearchDto {
  @IsEnum(SearchHistoryType)
  type: SearchHistoryType;

  @IsOptional()
  @IsString()
  query?: string;

  @IsOptional()
  @IsString()
  songId?: string;

  @IsOptional()
  @IsString()
  artistId?: string;

  @IsOptional()
  @IsString()
  albumId?: string;

  @IsOptional()
  @IsString()
  playlistId?: string;
}

import { IsNotEmpty, IsString } from 'class-validator';

export class AddToJamQueueDto {
  @IsNotEmpty()
  @IsString()
  songId: string;
}


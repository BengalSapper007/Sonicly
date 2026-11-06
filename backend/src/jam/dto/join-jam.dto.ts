import { IsNotEmpty, IsString } from 'class-validator';

export class JoinJamDto {
  @IsNotEmpty()
  @IsString()
  code: string;
}

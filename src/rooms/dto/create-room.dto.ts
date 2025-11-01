import { IsOptional, IsString } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  code: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  owner: string;
}

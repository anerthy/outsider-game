import { IsOptional, IsString } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  code: string;

  @IsString()
  owner: string;
}

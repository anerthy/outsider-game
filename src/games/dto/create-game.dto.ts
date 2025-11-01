import { IsArray, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateGameDto {
  // @IsArray()
  // @IsNotEmpty()
  // players: string[];

  @IsString()
  @IsNotEmpty()
  theme: string;

  @IsString()
  @IsNotEmpty()
  language: string;

  @IsString()
  @IsNotEmpty()
  vocabulary: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  outsiders: number;
}

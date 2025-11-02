import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateGameDto {
  @IsString()
  roomId: string;

  @IsString()
  @IsOptional()
  mode: string = 'classic';

  @IsString()
  category: string;

  @IsString()
  @IsOptional()
  difficulty: string = 'normal';

  @IsString()
  language: string;

  @IsString()
  @IsOptional()
  vocabularyCountry: string;

  @IsBoolean()
  includeHint: boolean = true;

  @IsNumber()
  @Min(1)
  outsidersCount: number = 1;
}

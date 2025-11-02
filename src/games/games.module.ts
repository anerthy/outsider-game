import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GeminiService } from './gemini.service';
import { GamesController } from './games.controller';
import { RoomsModule } from 'src/rooms/rooms.module';
import { RoomsService } from 'src/rooms/rooms.service';

@Module({
  controllers: [GamesController],
  providers: [GamesService, RoomsService, GeminiService],
  imports: [RoomsModule],
  exports: [GamesService],
})
export class GamesModule {}

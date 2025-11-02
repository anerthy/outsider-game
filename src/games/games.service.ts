import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { Game } from './entities/game.entity';
import { v4 as uuid } from 'uuid';
import { RoomsService } from '../rooms/rooms.service';
import { GeminiService } from './gemini.service';
import { TopicGame, GameCardPlayer } from './interfaces';
@Injectable()
export class GamesService {
  constructor(
    private readonly roomService: RoomsService,
    private readonly geminiService: GeminiService,
  ) {}

  private assignRoles(
    players: string[],
    outsidersCount: number,
    includeHint: boolean,
    wordCard: TopicGame,
  ): GameCardPlayer[] {
    const outsiders = players
      .sort(() => Math.random() - 0.5)
      .slice(0, outsidersCount);

    const gameCards: GameCardPlayer[] = players
      .sort(() => Math.random() - 0.5)
      .map((player) => {
        const isOutsider = outsiders.includes(player);
        const hint = includeHint
          ? wordCard.hints[Math.floor(Math.random() * wordCard.hints.length)]
          : '';

        return {
          id: player,
          role: isOutsider ? 'outsider' : 'civil',
          word: isOutsider ? hint : wordCard.word,
        };
      });

    return gameCards;
  }

  async create(createGameDto: CreateGameDto) {
    const {
      roomId,
      category,
      language,
      vocabularyCountry,
      includeHint,
      outsidersCount,
    } = createGameDto;

    const room = this.roomService.findOne(roomId);

    if (room.players.length < 3) {
      throw new BadRequestException(
        'At least 3 players are required to start the game.',
      );
    }

    if (room.players.length * 0.33 < outsidersCount) {
      throw new BadRequestException(
        'Outsiders count exceeds one third of the number of players.',
      );
    }

    const topicGame: TopicGame = await this.geminiService.generateTopicGame({
      roomId,
      category,
      language,
      vocabularyCountry: 'Costa Rica',
      hintsCount: outsidersCount,
    });

    const gamePlayers: GameCardPlayer[] = this.assignRoles(
      room.players,
      outsidersCount,
      includeHint,
      topicGame,
    );

    const game: Game = {
      id: uuid(),
      roomId,
      mode: 'classic',
      difficulty: 'normal',
      category,
      language,
      vocabularyCountry,
      includeHint,
      outsidersCount,
      topicGame: topicGame,
      players: gamePlayers,
    };

    return game;
  }

  findAll() {
    return `This action returns all games`;
  }

  findOne(id: number) {
    return `This action returns a #${id} game`;
  }

  remove(id: number) {
    return `This action removes a #${id} game`;
  }
}

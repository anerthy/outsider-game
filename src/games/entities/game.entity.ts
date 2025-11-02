import { GameCardPlayer, TopicGame } from '../interfaces';

export class Game {
  roomId: string;
  id: string;
  mode: string;
  category: string;
  difficulty: string;
  language: string;
  vocabularyCountry: string;
  includeHint: boolean;
  outsidersCount: number;
  topicGame: TopicGame;
  players: GameCardPlayer[] = [];
}

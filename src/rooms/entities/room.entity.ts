export class Room {
  id: string;
  code: string;
  name: string;
  owner: string;
  players: string[];
  // maxPlayers: number;
  game?: string;
  createdAt: Date;
}

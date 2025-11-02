export interface GameCardPlayer {
  id: string;
  role: 'outsider' | 'civil' | 'nobody';
  word: string;
}

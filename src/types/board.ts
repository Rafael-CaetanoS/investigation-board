export type CardType = 'suspect' | 'evidence' | 'theory' | 'timeline';

export interface BoardCard {
  id: string;
  type: CardType;
  title: string;
  description: string;
  x: number;
  y: number;
  imageUrl?: string;
}

export interface Connection {
  id: string;
  fromId: string;
  toId: string;
  label?: string;
}

export interface BoardState {
  cards: BoardCard[];
  connections: Connection[];
}

export type CardType = 'suspect' | 'evidence' | 'theory' | 'timeline';
export type ConnectionColor = 'red' | 'green' | 'blue';

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
  color: ConnectionColor;
}

export interface BoardState {
  cards: BoardCard[];
  connections: Connection[];
}

// Pre-made image assets
export interface PresetImage {
  id: string;
  src: string;
  label: string;
  category: 'profile' | 'evidence';
}

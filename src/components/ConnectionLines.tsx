import { BoardCard, Connection } from '@/types/board';

const CARD_WIDTH = 220;
const CARD_HEADER_HEIGHT = 40;

interface Props {
  connections: Connection[];
  cards: BoardCard[];
  onDeleteConnection: (id: string) => void;
}

export default function ConnectionLines({ connections, cards, onDeleteConnection }: Props) {
  const cardMap = new Map(cards.map(c => [c.id, c]));

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
      <defs>
        <filter id="string-shadow">
          <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="rgba(0,0,0,0.5)" />
        </filter>
      </defs>
      {connections.map(conn => {
        const from = cardMap.get(conn.fromId);
        const to = cardMap.get(conn.toId);
        if (!from || !to) return null;

        const x1 = from.x + CARD_WIDTH / 2;
        const y1 = from.y + CARD_HEADER_HEIGHT / 2;
        const x2 = to.x + CARD_WIDTH / 2;
        const y2 = to.y + CARD_HEADER_HEIGHT / 2;

        // Slight curve for visual interest
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2 - 20;

        return (
          <g key={conn.id}>
            {/* String line */}
            <path
              d={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
              fill="none"
              stroke="hsl(0 70% 50%)"
              strokeWidth="2"
              strokeDasharray="none"
              filter="url(#string-shadow)"
              opacity="0.8"
            />
            {/* Clickable area for deletion */}
            <path
              d={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
              fill="none"
              stroke="transparent"
              strokeWidth="16"
              className="pointer-events-auto cursor-pointer"
              onClick={() => onDeleteConnection(conn.id)}
            >
              <title>Clique para remover conexão</title>
            </path>
            {/* Pin dots at endpoints */}
            <circle cx={x1} cy={y1} r="3" fill="hsl(0 70% 50%)" />
            <circle cx={x2} cy={y2} r="3" fill="hsl(0 70% 50%)" />
          </g>
        );
      })}
    </svg>
  );
}

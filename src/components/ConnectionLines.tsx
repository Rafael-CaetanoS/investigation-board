import { BoardCard, Connection, ConnectionColor } from '@/types/board';

const CARD_WIDTH = 210;

const colorMap: Record<ConnectionColor, string> = {
  red: 'hsl(0, 70%, 50%)',
  green: 'hsl(140, 60%, 45%)',
  blue: 'hsl(210, 70%, 55%)',
};

const glowMap: Record<ConnectionColor, string> = {
  red: 'rgba(200, 50, 50, 0.3)',
  green: 'rgba(50, 160, 80, 0.3)',
  blue: 'rgba(50, 100, 200, 0.3)',
};

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
        {(['red', 'green', 'blue'] as ConnectionColor[]).map(color => (
          <filter key={color} id={`glow-${color}`}>
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={glowMap[color]} />
          </filter>
        ))}
      </defs>
      {connections.map(conn => {
        const from = cardMap.get(conn.fromId);
        const to = cardMap.get(conn.toId);
        if (!from || !to) return null;

        const x1 = from.x + CARD_WIDTH / 2;
        const y1 = from.y + 8;
        const x2 = to.x + CARD_WIDTH / 2;
        const y2 = to.y + 8;

        const color = conn.color || 'red';
        const strokeColor = colorMap[color];

        // Curve calculation
        const dx = x2 - x1;
        const dy = y2 - y1;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const sag = Math.min(dist * 0.15, 40);
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2 + sag;

        return (
          <g key={conn.id}>
            {/* Glow effect */}
            <path
              d={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
              fill="none"
              stroke={strokeColor}
              strokeWidth="4"
              opacity="0.3"
              filter={`url(#glow-${color})`}
            />
            {/* Main string line */}
            <path
              d={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
              fill="none"
              stroke={strokeColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.85"
            />
            {/* Clickable area */}
            <path
              d={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
              fill="none"
              stroke="transparent"
              strokeWidth="18"
              className="pointer-events-auto cursor-pointer"
              onClick={() => onDeleteConnection(conn.id)}
            >
              <title>Clique para remover conexão</title>
            </path>
            {/* Pin dots */}
            <circle cx={x1} cy={y1} r="4" fill={strokeColor} stroke="hsl(30, 15%, 10%)" strokeWidth="1" />
            <circle cx={x2} cy={y2} r="4" fill={strokeColor} stroke="hsl(30, 15%, 10%)" strokeWidth="1" />
          </g>
        );
      })}
    </svg>
  );
}

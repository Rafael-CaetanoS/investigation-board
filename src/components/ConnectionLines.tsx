import { BoardCard, Connection, ConnectionColor } from '@/types/board';

const CARD_WIDTH = 200;

const colorMap: Record<ConnectionColor, string> = {
  red: 'hsl(0, 72%, 50%)',
  green: 'hsl(140, 60%, 45%)',
  blue: 'hsl(210, 70%, 55%)',
};

interface Props {
  connections: Connection[];
  cards: BoardCard[];
  onDeleteConnection: (id: string) => void;
}

export default function ConnectionLines({ connections, cards, onDeleteConnection }: Props) {
  const cardMap = new Map(cards.map(c => [c.id, c]));

  // Container that holds the board; used to compute coordinates relative to the svg.
  const container = typeof document !== 'undefined' ? document.querySelector('[data-board-container]') as HTMLElement | null : null;
  const containerRect = container ? container.getBoundingClientRect() : { left: 0, top: 0 } as DOMRect;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
      <defs>
        {(['red', 'green', 'blue'] as ConnectionColor[]).map(color => (
          <filter key={color} id={`glow-${color}`}>
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        ))}
      </defs>
      {connections.map(conn => {
        const from = cardMap.get(conn.fromId);
        const to = cardMap.get(conn.toId);
        if (!from || !to) return null;

        // Try to locate DOM elements for more accurate pin positions; fallback to stored coordinates.
        const fromEl = typeof document !== 'undefined' ? document.querySelector(`[data-card-id="${conn.fromId}"]`) as HTMLElement | null : null;
        const toEl = typeof document !== 'undefined' ? document.querySelector(`[data-card-id="${conn.toId}"]`) as HTMLElement | null : null;

        let x1: number, y1: number, x2: number, y2: number;
        if (fromEl && toEl && containerRect) {
          const fRect = fromEl.getBoundingClientRect();
          const tRect = toEl.getBoundingClientRect();
          x1 = fRect.left - containerRect.left + fRect.width / 2;
          y1 = fRect.top - containerRect.top + 8;
          x2 = tRect.left - containerRect.left + tRect.width / 2;
          y2 = tRect.top - containerRect.top + 8;
        } else {
          x1 = from.x + CARD_WIDTH / 2;
          y1 = from.y + 8;
          x2 = to.x + CARD_WIDTH / 2;
          y2 = to.y + 8;
        }

        const color = conn.color || 'red';
        const strokeColor = colorMap[color];

        const dx = x2 - x1;
        const dy = y2 - y1;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const sag = Math.min(dist * 0.12, 35);
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2 + sag;

        return (
          <g key={conn.id}>
            {/* Glow */}
            <path
              d={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
              fill="none" stroke={strokeColor} strokeWidth="6" opacity="0.15"
              filter={`url(#glow-${color})`}
            />
            {/* Main line */}
            <path
              d={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
              fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" opacity="0.9"
            />
            {/* Dashes overlay for texture */}
            <path
              d={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
              fill="none" stroke={strokeColor} strokeWidth="1" strokeDasharray="8 12" opacity="0.3"
            />
            {/* Click area */}
            <path
              d={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
              fill="none" stroke="transparent" strokeWidth="20"
              className="pointer-events-auto cursor-pointer"
              onClick={() => onDeleteConnection(conn.id)}
            >
              <title>Clique para remover conexão</title>
            </path>
            {/* Pins */}
            <circle cx={x1} cy={y1} r="4" fill={strokeColor} stroke="hsl(25, 18%, 10%)" strokeWidth="1.5" />
            <circle cx={x2} cy={y2} r="4" fill={strokeColor} stroke="hsl(25, 18%, 10%)" strokeWidth="1.5" />
          </g>
        );
      })}
    </svg>
  );
}

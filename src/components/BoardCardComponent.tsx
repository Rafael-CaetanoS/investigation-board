import { useRef, useState, useCallback } from 'react';
import { BoardCard, CardType } from '@/types/board';
import { User, Search, Lightbulb, Clock, X, Link, GripVertical } from 'lucide-react';

const typeConfig: Record<CardType, { icon: typeof User; colorVar: string; glowVar: string; label: string }> = {
  suspect: { icon: User, colorVar: '--suspect', glowVar: '--suspect-glow', label: 'SUSPEITO' },
  evidence: { icon: Search, colorVar: '--evidence', glowVar: '--evidence-glow', label: 'PROVA' },
  theory: { icon: Lightbulb, colorVar: '--theory', glowVar: '--theory-glow', label: 'TEORIA' },
  timeline: { icon: Clock, colorVar: '--timeline-color', glowVar: '--timeline-glow', label: 'HORÁRIO' },
};

interface Props {
  card: BoardCard;
  isConnecting: boolean;
  isConnectingSource: boolean;
  onMove: (id: string, x: number, y: number) => void;
  onDelete: (id: string) => void;
  onConnect: (id: string) => void;
}

export default function BoardCardComponent({ card, isConnecting, isConnectingSource, onMove, onDelete, onConnect }: Props) {
  const config = typeConfig[card.type];
  const Icon = config.icon;
  const dragRef = useRef<{ startX: number; startY: number; cardX: number; cardY: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('[data-no-drag]')) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    dragRef.current = { startX: e.clientX, startY: e.clientY, cardX: card.x, cardY: card.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [card.x, card.y]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    onMove(card.id, dragRef.current.cardX + dx, dragRef.current.cardY + dy);
  }, [card.id, onMove]);

  const handlePointerUp = useCallback(() => {
    dragRef.current = null;
    setIsDragging(false);
  }, []);

  const hasImage = !!card.imageUrl;

  return (
    <div
      className={`absolute select-none card-pin ${isDragging ? 'z-50' : 'z-10'}`}
      style={{ left: card.x, top: card.y, width: 200 }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div
        className={`
          rounded overflow-hidden transition-all duration-200 border
          ${isDragging ? 'card-shadow-hover scale-[1.04]' : 'card-shadow'}
          ${isConnectingSource ? 'ring-2 ring-primary animate-pulse-glow' : ''}
          ${isConnecting && !isConnectingSource ? 'hover:ring-2 hover:ring-primary cursor-crosshair' : ''}
        `}
        style={{
          background: `hsl(0 0% 7%)`,
          borderColor: `hsl(var(${config.colorVar}) / 0.25)`,
          borderLeft: `3px solid hsl(var(${config.colorVar}))`,
        }}
      >
        {/* Image */}
        {hasImage && (
          <div className="relative w-full h-28 overflow-hidden">
            <img src={card.imageUrl} alt={card.title} className="w-full h-full object-cover" draggable={false} />
            <div className="absolute inset-0 bg-gradient-to-t from-[hsl(0,0%,7%)] via-transparent to-transparent" />
          </div>
        )}

        {/* Type badge */}
        <div className="px-2.5 py-1 flex items-center justify-between" style={{ background: `hsl(var(${config.colorVar}) / 0.12)` }}>
          <div className="flex items-center gap-1.5">
            <Icon size={10} style={{ color: `hsl(var(${config.colorVar}))` }} />
            <span className="text-[8px] font-bold tracking-[0.25em] font-detective" style={{ color: `hsl(var(${config.colorVar}))` }}>
              {config.label}
            </span>
          </div>
          <div className="flex items-center gap-0.5" data-no-drag>
            <button onClick={() => onConnect(card.id)} className="p-0.5 rounded hover:bg-foreground/10 transition-colors text-muted-foreground hover:text-foreground">
              <Link size={10} />
            </button>
            <button onClick={() => onDelete(card.id)} className="p-0.5 rounded hover:bg-primary/20 transition-colors text-muted-foreground hover:text-primary">
              <X size={10} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-3 py-2">
          <h3 className="font-display text-[13px] font-bold text-foreground leading-tight">{card.title}</h3>
          {card.description && (
            <p className="text-[10px] text-muted-foreground font-typewriter leading-relaxed mt-1.5 line-clamp-3">{card.description}</p>
          )}
        </div>

        {/* Bottom accent */}
        <div className="h-[1px]" style={{ background: `linear-gradient(90deg, hsl(var(${config.colorVar}) / 0.5), transparent)` }} />
      </div>
    </div>
  );
}

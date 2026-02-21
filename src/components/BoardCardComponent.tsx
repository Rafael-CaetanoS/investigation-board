import { useRef, useState, useCallback } from 'react';
import { BoardCard, CardType } from '@/types/board';
import { User, Search, Lightbulb, Clock, X, Link, GripVertical } from 'lucide-react';

const typeConfig: Record<CardType, { icon: typeof User; colorClass: string; label: string }> = {
  suspect: { icon: User, colorClass: 'bg-suspect text-suspect-foreground', label: 'Suspeito' },
  evidence: { icon: Search, colorClass: 'bg-evidence text-evidence-foreground', label: 'Prova' },
  theory: { icon: Lightbulb, colorClass: 'bg-theory text-theory-foreground', label: 'Teoria' },
  timeline: { icon: Clock, colorClass: 'bg-timeline text-timeline-foreground', label: 'Horário' },
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

  return (
    <div
      className={`absolute select-none card-pin ${isDragging ? 'z-50' : 'z-10'}`}
      style={{ left: card.x, top: card.y, width: 220 }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div className={`
        rounded border border-border bg-card shadow-lg overflow-hidden
        transition-shadow duration-200
        ${isConnectingSource ? 'ring-2 ring-string-red shadow-[0_0_15px_hsl(var(--string-red)/0.4)]' : ''}
        ${isConnecting && !isConnectingSource ? 'hover:ring-2 hover:ring-string-red cursor-crosshair' : ''}
        ${isDragging ? 'shadow-2xl' : ''}
      `}>
        {/* Header */}
        <div className={`${config.colorClass} px-3 py-1.5 flex items-center justify-between`}>
          <div className="flex items-center gap-1.5">
            <Icon size={14} />
            <span className="text-xs font-bold uppercase tracking-wider font-detective">{config.label}</span>
          </div>
          <div className="flex items-center gap-1" data-no-drag>
            <button
              onClick={() => onConnect(card.id)}
              className="p-0.5 rounded hover:bg-black/20 transition-colors"
              title={isConnecting ? "Conectar aqui" : "Iniciar conexão"}
            >
              <Link size={12} />
            </button>
            <button
              onClick={() => onDelete(card.id)}
              className="p-0.5 rounded hover:bg-black/20 transition-colors"
              title="Remover"
            >
              <X size={12} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-3">
          <h3 className="font-detective text-sm font-bold text-foreground mb-1 leading-tight">{card.title}</h3>
          {card.description && (
            <p className="text-xs text-muted-foreground font-typewriter leading-relaxed">{card.description}</p>
          )}
        </div>

        {/* Drag handle */}
        <div className="flex justify-center pb-1 text-muted-foreground/30">
          <GripVertical size={14} />
        </div>
      </div>
    </div>
  );
}

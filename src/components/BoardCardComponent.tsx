import { useRef, useState, useCallback } from 'react';
import { BoardCard, CardType } from '@/types/board';
import { User, Search, Lightbulb, Clock, X, Link, GripVertical } from 'lucide-react';

const typeConfig: Record<CardType, { icon: typeof User; colorClass: string; borderAccent: string; label: string }> = {
  suspect: { icon: User, colorClass: 'bg-suspect text-suspect-foreground', borderAccent: 'border-l-suspect', label: 'Suspeito' },
  evidence: { icon: Search, colorClass: 'bg-evidence text-evidence-foreground', borderAccent: 'border-l-evidence', label: 'Prova' },
  theory: { icon: Lightbulb, colorClass: 'bg-theory text-theory-foreground', borderAccent: 'border-l-theory', label: 'Teoria' },
  timeline: { icon: Clock, colorClass: 'bg-timeline text-timeline-foreground', borderAccent: 'border-l-timeline', label: 'Horário' },
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

  const hasImage = card.imageUrl;

  return (
    <div
      className={`absolute select-none card-pin ${isDragging ? 'z-50' : 'z-10'}`}
      style={{ left: card.x, top: card.y, width: hasImage ? 200 : 220 }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div className={`
        rounded border-l-4 ${config.borderAccent} bg-card/95 backdrop-blur-sm overflow-hidden
        transition-all duration-200 border border-border
        ${isConnectingSource ? 'ring-2 ring-string-red shadow-[0_0_20px_hsl(var(--string-red)/0.5)]' : ''}
        ${isConnecting && !isConnectingSource ? 'hover:ring-2 hover:ring-string-red cursor-crosshair hover:shadow-[0_0_15px_hsl(var(--string-red)/0.3)]' : ''}
        ${isDragging ? 'shadow-[0_15px_40px_rgba(0,0,0,0.6)] scale-105' : 'shadow-[0_4px_15px_rgba(0,0,0,0.4)]'}
      `}>
        {/* Image */}
        {hasImage && (
          <div className="w-full h-28 overflow-hidden">
            <img
              src={card.imageUrl}
              alt={card.title}
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
        )}

        {/* Header */}
        <div className={`${config.colorClass} px-3 py-1.5 flex items-center justify-between`}>
          <div className="flex items-center gap-1.5">
            <Icon size={13} />
            <span className="text-[10px] font-bold uppercase tracking-widest font-detective">{config.label}</span>
          </div>
          <div className="flex items-center gap-0.5" data-no-drag>
            <button
              onClick={() => onConnect(card.id)}
              className="p-1 rounded hover:bg-black/20 transition-colors"
              title={isConnecting ? "Conectar aqui" : "Iniciar conexão"}
            >
              <Link size={12} />
            </button>
            <button
              onClick={() => onDelete(card.id)}
              className="p-1 rounded hover:bg-black/20 transition-colors"
              title="Remover"
            >
              <X size={12} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-3 py-2">
          <h3 className="font-detective text-sm font-bold text-foreground leading-tight">{card.title}</h3>
          {card.description && (
            <p className="text-[11px] text-muted-foreground font-typewriter leading-relaxed mt-1">{card.description}</p>
          )}
        </div>

        {/* Drag indicator */}
        <div className="flex justify-center pb-1 text-muted-foreground/20">
          <GripVertical size={12} />
        </div>
      </div>
    </div>
  );
}

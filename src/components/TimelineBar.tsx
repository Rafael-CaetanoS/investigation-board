import { useState } from 'react';
import { TimelineEvent } from '@/types/board';
import { Clock, Plus, X, ChevronUp, ChevronDown } from 'lucide-react';

interface Props {
  events: TimelineEvent[];
  onAdd: (time: string, description: string) => void;
  onDelete: (id: string) => void;
}

export default function TimelineBar({ events, onAdd, onDelete }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newTime, setNewTime] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleAdd = () => {
    if (!newTime.trim() || !newDesc.trim()) return;
    onAdd(newTime.trim(), newDesc.trim());
    setNewTime('');
    setNewDesc('');
  };

  return (
    <div className={`
      fixed bottom-0 left-0 right-0 z-40
      glass-panel border-t border-border
      transition-all duration-300 ease-out
      ${isExpanded ? 'max-h-[280px]' : 'max-h-[44px]'}
    `}>
      {/* Toggle bar */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-timeline-color" />
          <span className="font-detective text-xs text-timeline-color tracking-wider">LINHA DO TEMPO</span>
          {events.length > 0 && (
            <span className="text-[9px] text-muted-foreground font-typewriter bg-muted px-1.5 py-0.5 rounded">
              {events.length} eventos
            </span>
          )}
        </div>
        {isExpanded ? <ChevronDown size={14} className="text-muted-foreground" /> : <ChevronUp size={14} className="text-muted-foreground" />}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="px-4 pb-3">
          {/* Add event */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newTime}
              onChange={e => setNewTime(e.target.value)}
              placeholder="Horário (ex: 22:30)"
              className="w-28 bg-muted/50 border border-border rounded px-2 py-1.5 text-[11px] text-foreground font-typewriter placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-timeline-color/50"
            />
            <input
              type="text"
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
              placeholder="O que aconteceu..."
              className="flex-1 bg-muted/50 border border-border rounded px-2 py-1.5 text-[11px] text-foreground font-typewriter placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-timeline-color/50"
            />
            <button
              onClick={handleAdd}
              disabled={!newTime.trim() || !newDesc.trim()}
              className="p-1.5 bg-timeline-color text-timeline-color-foreground rounded hover:opacity-90 disabled:opacity-30 transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Timeline scroll */}
          <div className="overflow-x-auto custom-scrollbar pb-2">
            {events.length === 0 ? (
              <p className="text-center text-[10px] text-muted-foreground/50 font-typewriter py-3">
                Adicione eventos para construir a linha do tempo do caso
              </p>
            ) : (
              <div className="flex items-start gap-0 min-w-max relative">
                {/* Horizontal line */}
                <div className="absolute top-[9px] left-4 right-4 h-[2px] bg-timeline-color/30" />

                {events.map((evt, i) => (
                  <div key={evt.id} className="flex flex-col items-center min-w-[140px] relative group px-2">
                    {/* Dot */}
                    <div className="w-[18px] h-[18px] rounded-full border-2 border-timeline-color bg-card z-10 flex items-center justify-center">
                      <div className="w-[6px] h-[6px] rounded-full bg-timeline-color" />
                    </div>
                    {/* Time */}
                    <span className="font-detective text-[11px] text-timeline-color mt-1.5 font-bold">{evt.time}</span>
                    {/* Description */}
                    <p className="text-[10px] text-secondary-foreground font-typewriter text-center leading-tight mt-0.5 max-w-[130px]">
                      {evt.description}
                    </p>
                    {/* Delete */}
                    <button
                      onClick={() => onDelete(evt.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity mt-1 p-0.5 rounded hover:bg-destructive/20"
                    >
                      <X size={10} className="text-muted-foreground" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

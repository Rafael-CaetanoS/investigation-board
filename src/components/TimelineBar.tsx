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
      bg-background/98 backdrop-blur-md border-t border-border
      transition-all duration-300 ease-out
      ${isExpanded ? 'max-h-[260px]' : 'max-h-[40px]'}
    `}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-2 hover:bg-card/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Clock size={13} className="text-primary" />
          <span className="font-detective text-[10px] text-primary tracking-[0.2em]">LINHA DO TEMPO</span>
          {events.length > 0 && (
            <span className="text-[9px] text-muted-foreground font-typewriter bg-card px-1.5 py-0.5 rounded border border-border">
              {events.length}
            </span>
          )}
        </div>
        {isExpanded ? <ChevronDown size={13} className="text-muted-foreground" /> : <ChevronUp size={13} className="text-muted-foreground" />}
      </button>

      {isExpanded && (
        <div className="px-4 pb-3">
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newTime}
              onChange={e => setNewTime(e.target.value)}
              placeholder="Horário"
              className="w-24 bg-card border border-border rounded px-2 py-1.5 text-[11px] text-foreground font-typewriter placeholder:text-muted-foreground focus:outline-none focus:border-primary/40"
            />
            <input
              type="text"
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
              placeholder="O que aconteceu..."
              className="flex-1 bg-card border border-border rounded px-2 py-1.5 text-[11px] text-foreground font-typewriter placeholder:text-muted-foreground focus:outline-none focus:border-primary/40"
            />
            <button
              onClick={handleAdd}
              disabled={!newTime.trim() || !newDesc.trim()}
              className="p-1.5 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-20 transition-colors"
            >
              <Plus size={13} />
            </button>
          </div>

          <div className="overflow-x-auto custom-scrollbar pb-2">
            {events.length === 0 ? (
              <p className="text-center text-[10px] text-muted-foreground/30 font-typewriter py-4">
                Adicione eventos para construir a cronologia
              </p>
            ) : (
              <div className="flex items-start gap-0 min-w-max relative">
                <div className="absolute top-[8px] left-4 right-4 h-[1px] bg-primary/20" />
                {events.map(evt => (
                  <div key={evt.id} className="flex flex-col items-center min-w-[130px] relative group px-2">
                    <div className="w-4 h-4 rounded-full border-2 border-primary bg-background z-10 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    </div>
                    <span className="font-detective text-[11px] text-primary mt-1.5 font-bold">{evt.time}</span>
                    <p className="text-[10px] text-foreground/60 font-typewriter text-center leading-tight mt-0.5 max-w-[120px]">
                      {evt.description}
                    </p>
                    <button
                      onClick={() => onDelete(evt.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity mt-1 p-0.5 rounded hover:bg-primary/10"
                    >
                      <X size={9} className="text-muted-foreground" />
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

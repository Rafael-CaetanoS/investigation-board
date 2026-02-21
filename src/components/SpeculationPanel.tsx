import { useState } from 'react';
import { Speculation } from '@/types/board';
import { MessageSquare, Plus, X, Check, ChevronRight, ChevronLeft } from 'lucide-react';

interface Props {
  speculations: Speculation[];
  onAdd: (text: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function SpeculationPanel({ speculations, onAdd, onToggle, onDelete }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [newText, setNewText] = useState('');

  const handleAdd = () => {
    if (!newText.trim()) return;
    onAdd(newText.trim());
    setNewText('');
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          fixed right-0 top-1/2 -translate-y-1/2 z-40
          glass-panel rounded-l-lg px-1.5 py-4 
          flex flex-col items-center gap-1
          hover:bg-secondary/80 transition-all duration-300
          ${isOpen ? 'translate-x-full opacity-0' : ''}
        `}
      >
        <MessageSquare size={16} className="text-primary" />
        <span className="font-detective text-[9px] text-muted-foreground writing-mode-vertical"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          NOTAS
        </span>
        {speculations.length > 0 && (
          <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] flex items-center justify-center font-bold">
            {speculations.length}
          </span>
        )}
      </button>

      {/* Panel */}
      <div className={`
        fixed right-0 top-[52px] bottom-0 z-40 w-72
        glass-panel border-l border-border
        transition-transform duration-300 ease-out
        flex flex-col
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <MessageSquare size={14} className="text-primary" />
            <h2 className="font-detective text-sm text-primary tracking-wider">Especulações</h2>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-1 rounded hover:bg-muted transition-colors">
            <ChevronRight size={14} className="text-muted-foreground" />
          </button>
        </div>

        {/* Input */}
        <div className="p-3 border-b border-border">
          <div className="flex gap-1.5">
            <textarea
              value={newText}
              onChange={e => setNewText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAdd(); }}}
              placeholder="Nova teoria, palpite, anotação..."
              className="flex-1 bg-muted/50 border border-border rounded px-2 py-1.5 text-[11px] text-foreground font-typewriter placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary/50"
              rows={2}
            />
            <button
              onClick={handleAdd}
              disabled={!newText.trim()}
              className="self-end p-1.5 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-30 transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1.5">
          {speculations.length === 0 && (
            <p className="text-center text-[10px] text-muted-foreground/50 font-typewriter mt-8 px-4">
              Nenhuma especulação ainda. Anote suas teorias e palpites aqui.
            </p>
          )}
          {speculations.map(spec => (
            <div
              key={spec.id}
              className={`
                group rounded border border-border/50 px-2.5 py-2 bg-muted/30
                transition-all duration-150 hover:bg-muted/50
                ${spec.resolved ? 'opacity-50' : ''}
              `}
            >
              <p className={`text-[11px] font-typewriter text-secondary-foreground leading-relaxed ${spec.resolved ? 'line-through' : ''}`}>
                {spec.text}
              </p>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[9px] text-muted-foreground">
                  {new Date(spec.createdAt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                </span>
                <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onToggle(spec.id)} className="p-0.5 rounded hover:bg-muted" title={spec.resolved ? 'Reabrir' : 'Resolver'}>
                    <Check size={10} className={spec.resolved ? 'text-primary' : 'text-muted-foreground'} />
                  </button>
                  <button onClick={() => onDelete(spec.id)} className="p-0.5 rounded hover:bg-destructive/20" title="Apagar">
                    <X size={10} className="text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

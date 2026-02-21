import { CardType, ConnectionColor } from '@/types/board';
import AddItemDialog from './AddItemDialog';
import { X, RotateCcw, ArrowLeft, Crosshair } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface Props {
  caseName: string;
  onCaseNameChange: (name: string) => void;
  onAdd: (type: CardType, title: string, description: string, imageUrl?: string) => void;
  onReset: () => void;
  isConnecting: boolean;
  onCancelConnection: () => void;
  cardCount: number;
  connectionCount: number;
  connectionColor: ConnectionColor;
  onConnectionColorChange: (color: ConnectionColor) => void;
}

const colorOptions: { value: ConnectionColor; label: string; cssVar: string }[] = [
  { value: 'red', label: 'Vermelho', cssVar: '--string-red' },
  { value: 'green', label: 'Verde', cssVar: '--string-green' },
  { value: 'blue', label: 'Azul', cssVar: '--string-blue' },
];

export default function BoardToolbar({
  caseName, onCaseNameChange, onAdd, onReset, isConnecting, onCancelConnection,
  cardCount, connectionCount, connectionColor, onConnectionColorChange,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(caseName);
  const navigate = useNavigate();

  const handleNameSave = () => {
    onCaseNameChange(tempName.trim() || 'Caso Sem Nome');
    setIsEditing(false);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between px-4 h-12">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-1.5 rounded-md hover:bg-card transition-colors text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={16} />
          </button>
          
          <div className="w-[1px] h-5 bg-border" />
          
          {isEditing ? (
            <input
              value={tempName}
              onChange={e => setTempName(e.target.value)}
              onBlur={handleNameSave}
              onKeyDown={e => { if (e.key === 'Enter') handleNameSave(); }}
              className="bg-card border border-primary/40 rounded px-2 py-0.5 text-sm font-display font-bold text-primary w-52 focus:outline-none"
              autoFocus
            />
          ) : (
            <button
              onClick={() => { setTempName(caseName); setIsEditing(true); }}
              className="font-display text-sm font-bold text-primary hover:text-primary/80 transition-colors"
            >
              {caseName}
            </button>
          )}

          <span className="text-[9px] text-muted-foreground font-typewriter bg-card px-2 py-0.5 rounded border border-border">
            {cardCount} fichas · {connectionCount} fios
          </span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Connection color picker */}
          <div className="flex items-center gap-1 bg-card rounded-md px-2 py-1 border border-border">
            <Crosshair size={10} className="text-muted-foreground" />
            {colorOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => onConnectionColorChange(opt.value)}
                title={opt.label}
                className={`w-3.5 h-3.5 rounded-full transition-all ${
                  connectionColor === opt.value
                    ? 'scale-125 ring-1 ring-offset-1 ring-offset-background'
                    : 'opacity-30 hover:opacity-60'
                }`}
                style={{
                  backgroundColor: `hsl(var(${opt.cssVar}))`,
                  ...(connectionColor === opt.value ? { ringColor: `hsl(var(${opt.cssVar}))` } : {}),
                }}
              />
            ))}
          </div>

          {isConnecting && (
            <Button
              variant="outline"
              size="sm"
              onClick={onCancelConnection}
              className="gap-1 text-primary border-primary/30 hover:bg-primary/10 font-detective text-[10px] h-7"
            >
              <X size={12} />
              Cancelar
            </Button>
          )}

          <AddItemDialog onAdd={onAdd} />

          <button
            onClick={() => { if (window.confirm('⚠️ Resetar todo o caso?')) onReset(); }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[10px] font-detective text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all border border-border"
          >
            <RotateCcw size={11} />
            NOVO
          </button>
        </div>
      </div>

      {/* Connection mode bar */}
      {isConnecting && (
        <div className="px-4 py-1.5 border-t border-primary/20 bg-primary/5">
          <span className="text-[10px] text-primary font-detective animate-pulse-glow tracking-wider">
            ● MODO CONEXÃO — Selecione a segunda ficha
          </span>
        </div>
      )}
    </div>
  );
}

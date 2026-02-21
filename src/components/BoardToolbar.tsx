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
  onOpenCaseReader?: () => void;
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
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="flex items-center justify-between px-5 py-2 h-14">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-md hover:bg-card transition-colors text-muted-foreground hover:text-foreground flex items-center justify-center"
            title="Voltar"
          >
            <ArrowLeft size={16} />
          </button>

          <div className="flex flex-col">
            {isEditing ? (
              <input
                value={tempName}
                onChange={e => setTempName(e.target.value)}
                onBlur={handleNameSave}
                onKeyDown={e => { if (e.key === 'Enter') handleNameSave(); }}
                className="bg-card border border-primary/30 rounded px-3 py-1 text-sm font-display font-bold text-primary w-64 focus:outline-none"
                autoFocus
              />
            ) : (
              <button
                onClick={() => { setTempName(caseName); setIsEditing(true); }}
                className="font-display text-sm font-bold text-primary hover:text-primary/90 transition-colors text-left"
              >
                {caseName}
              </button>
            )}
            <span className="text-[11px] text-muted-foreground font-typewriter mt-0.5">{cardCount} fichas · {connectionCount} fios</span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Connection color picker */}
          <div className="flex items-center gap-2 bg-card rounded-xl px-3 py-1 border border-border shadow-sm">
            <Crosshair size={12} className="text-muted-foreground" />
            {colorOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => onConnectionColorChange(opt.value)}
                title={opt.label}
                className={`w-5 h-5 rounded-full transition-transform flex-shrink-0 ${
                  connectionColor === opt.value
                    ? 'scale-110 ring-2 ring-offset-1 ring-offset-background'
                    : 'opacity-60 hover:opacity-90'
                }`}
                style={{
                  backgroundColor: `hsl(var(${opt.cssVar}))`,
                }}
              />
            ))}
          </div>

          {isConnecting && (
            <Button
              variant="outline"
              size="sm"
              onClick={onCancelConnection}
              className="gap-1 text-primary border-primary/30 hover:bg-primary/10 font-detective text-[11px] h-8"
            >
              <X size={14} />
              Cancelar
            </Button>
          )}

          <AddItemDialog onAdd={onAdd} />

          <button
            onClick={() => onOpenCaseReader && onOpenCaseReader()}
            className="flex items-center gap-2 px-3 py-1 rounded-md text-[11px] font-detective text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all border border-border"
            title="Ler caso"
          >
            LER CASO
          </button>

          

          <button
            onClick={() => { if (window.confirm('⚠️ Resetar todo o caso?')) onReset(); }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-[11px] font-detective text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all border border-border"
            title="Criar novo caso"
          >
            <RotateCcw size={14} />
            RESET
          </button>
        </div>
      </div>

      {/* Connection mode bar */}
      {isConnecting && (
        <div className="px-5 py-2 border-t border-primary/20 bg-primary/6">
          <span className="text-[12px] text-primary font-detective animate-pulse-glow tracking-wider">
            ● MODO CONEXÃO — Selecione a segunda ficha
          </span>
        </div>
      )}
    </div>
  );
}

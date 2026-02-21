import { CardType, ConnectionColor } from '@/types/board';
import AddItemDialog from './AddItemDialog';
import { Trash2, X, RotateCcw, FileText, ArrowLeft } from 'lucide-react';
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
    <div className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-border">
      <div className="flex items-center justify-between px-4 py-2">
        {/* Left: Back + Case name */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            title="Voltar aos casos"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-primary" />
            {isEditing ? (
              <input
                value={tempName}
                onChange={e => setTempName(e.target.value)}
                onBlur={handleNameSave}
                onKeyDown={e => { if (e.key === 'Enter') handleNameSave(); }}
                className="bg-muted/50 border border-primary/50 rounded px-2 py-0.5 text-sm font-detective text-primary w-48 focus:outline-none"
                autoFocus
              />
            ) : (
              <button
                onClick={() => { setTempName(caseName); setIsEditing(true); }}
                className="font-detective text-base text-primary hover:text-primary/80 transition-colors tracking-wide"
                title="Clique para renomear"
              >
                {caseName}
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-0.5 rounded text-[9px] text-muted-foreground font-typewriter">
            <span>{cardCount} fichas</span>
            <span className="text-border">·</span>
            <span>{connectionCount} conexões</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Connection color */}
          <div className="flex items-center gap-1.5 bg-muted/30 rounded px-2 py-1">
            <span className="text-[9px] text-muted-foreground font-detective tracking-wider">LINHA</span>
            {colorOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => onConnectionColorChange(opt.value)}
                title={opt.label}
                className={`
                  w-4 h-4 rounded-full transition-all duration-150 border-2
                  ${connectionColor === opt.value
                    ? 'border-foreground scale-125'
                    : 'border-transparent opacity-40 hover:opacity-70'}
                `}
                style={{ backgroundColor: `hsl(var(${opt.cssVar}))` }}
              />
            ))}
          </div>

          {isConnecting && (
            <Button
              variant="outline"
              size="sm"
              onClick={onCancelConnection}
              className="gap-1 text-string-red border-string-red/50 hover:bg-accent/10 font-detective text-[10px] h-7"
            >
              <X size={12} />
              Cancelar
            </Button>
          )}

          <AddItemDialog onAdd={onAdd} />

          <button
            onClick={() => { if (window.confirm('⚠️ Resetar todo o caso e começar uma nova investigação?')) onReset(); }}
            className="flex items-center gap-1 px-2 py-1.5 rounded text-[10px] font-detective text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors border border-border"
            title="Novo caso"
          >
            <RotateCcw size={12} />
            NOVO CASO
          </button>
        </div>
      </div>

      {/* Connection mode indicator */}
      {isConnecting && (
        <div className="px-4 py-1 border-t border-string-red/20" style={{ background: 'linear-gradient(90deg, hsl(var(--string-red) / 0.1), transparent)' }}>
          <span className="text-[10px] text-string-red font-detective animate-pulse">
            ⬤ Modo conexão ativo — selecione a segunda ficha para ligar
          </span>
        </div>
      )}
    </div>
  );
}

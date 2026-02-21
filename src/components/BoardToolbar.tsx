import { CardType, ConnectionColor } from '@/types/board';
import AddItemDialog from './AddItemDialog';
import { Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  onAdd: (type: CardType, title: string, description: string, imageUrl?: string) => void;
  onClear: () => void;
  isConnecting: boolean;
  onCancelConnection: () => void;
  cardCount: number;
  connectionCount: number;
  connectionColor: ConnectionColor;
  onConnectionColorChange: (color: ConnectionColor) => void;
}

const colorOptions: { value: ConnectionColor; label: string; cssColor: string }[] = [
  { value: 'red', label: 'Vermelho', cssColor: 'bg-[hsl(0,70%,50%)]' },
  { value: 'green', label: 'Verde', cssColor: 'bg-[hsl(140,60%,45%)]' },
  { value: 'blue', label: 'Azul', cssColor: 'bg-[hsl(210,70%,55%)]' },
];

export default function BoardToolbar({ onAdd, onClear, isConnecting, onCancelConnection, cardCount, connectionCount, connectionColor, onConnectionColorChange }: Props) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-secondary/95 backdrop-blur-md border-b border-border shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
      <div className="flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-4">
          <h1 className="font-detective text-xl text-primary tracking-wider">
            🔍 Mural de Investigação
          </h1>
          <span className="text-[10px] text-muted-foreground font-typewriter bg-muted px-2 py-0.5 rounded">
            {cardCount} fichas · {connectionCount} conexões
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Connection color selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-muted-foreground font-detective">Cor da linha:</span>
            {colorOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => onConnectionColorChange(opt.value)}
                title={opt.label}
                className={`
                  w-5 h-5 rounded-full ${opt.cssColor} transition-all duration-150 border-2
                  ${connectionColor === opt.value 
                    ? 'border-foreground scale-125 shadow-lg' 
                    : 'border-transparent opacity-50 hover:opacity-80'}
                `}
              />
            ))}
          </div>

          <div className="w-px h-6 bg-border" />

          {isConnecting && (
            <Button
              variant="outline"
              size="sm"
              onClick={onCancelConnection}
              className="gap-1 text-string-red border-string-red/50 hover:bg-string-red/10 font-detective text-xs"
            >
              <X size={14} />
              Cancelar
            </Button>
          )}
          <AddItemDialog onAdd={onAdd} />
          {cardCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (window.confirm('Limpar todo o mural?')) onClear();
              }}
              className="gap-1 text-destructive border-destructive/30 hover:bg-destructive/10 font-detective text-xs"
            >
              <Trash2 size={14} />
            </Button>
          )}
        </div>
      </div>

      {isConnecting && (
        <div className="bg-string-red/10 text-center py-1 border-t border-string-red/20">
          <span className="text-xs text-string-red font-detective animate-pulse">
            🔗 Selecione a segunda ficha para conectar...
          </span>
        </div>
      )}
    </div>
  );
}

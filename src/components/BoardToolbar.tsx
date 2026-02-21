import { CardType } from '@/types/board';
import AddItemDialog from './AddItemDialog';
import { Trash2, Link, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  onAdd: (type: CardType, title: string, description: string) => void;
  onClear: () => void;
  isConnecting: boolean;
  onCancelConnection: () => void;
  cardCount: number;
  connectionCount: number;
}

export default function BoardToolbar({ onAdd, onClear, isConnecting, onCancelConnection, cardCount, connectionCount }: Props) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-secondary/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-3">
          <h1 className="font-detective text-xl text-primary tracking-wider">
            🔍 Mural de Investigação
          </h1>
          <span className="text-xs text-muted-foreground font-typewriter">
            {cardCount} fichas · {connectionCount} conexões
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isConnecting && (
            <Button
              variant="outline"
              size="sm"
              onClick={onCancelConnection}
              className="gap-1 text-string-red border-string-red/50 hover:bg-string-red/10 font-detective text-xs"
            >
              <X size={14} />
              Cancelar conexão
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
              Limpar
            </Button>
          )}
        </div>
      </div>

      {isConnecting && (
        <div className="bg-string-red/10 text-center py-1">
          <span className="text-xs text-string-red font-detective animate-pulse">
            🔗 Selecione a segunda ficha para conectar...
          </span>
        </div>
      )}
    </div>
  );
}

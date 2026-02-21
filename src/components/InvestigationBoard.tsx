import { useBoard } from '@/hooks/useBoard';
import BoardCardComponent from './BoardCardComponent';
import ConnectionLines from './ConnectionLines';
import BoardToolbar from './BoardToolbar';
import corkTexture from '@/assets/cork-texture.jpg';

export default function InvestigationBoard() {
  const board = useBoard();

  return (
    <div className="min-h-screen">
      <BoardToolbar
        onAdd={board.addCard}
        onClear={board.clearBoard}
        isConnecting={board.connectingFrom !== null}
        onCancelConnection={board.cancelConnection}
        cardCount={board.cards.length}
        connectionCount={board.connections.length}
        connectionColor={board.connectionColor}
        onConnectionColorChange={board.setConnectionColor}
      />

      {/* Board surface */}
      <div
        className="relative w-full overflow-auto"
        style={{
          minHeight: '100vh',
          height: '200vh',
          backgroundImage: `url(${corkTexture})`,
          backgroundSize: '512px 512px',
          backgroundRepeat: 'repeat',
          paddingTop: 60,
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-background/30 pointer-events-none" />
        
        {/* Vignette effect */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)'
        }} />

        <ConnectionLines
          connections={board.connections}
          cards={board.cards}
          onDeleteConnection={board.deleteConnection}
        />

        {board.cards.map(card => (
          <BoardCardComponent
            key={card.id}
            card={card}
            isConnecting={board.connectingFrom !== null}
            isConnectingSource={board.connectingFrom === card.id}
            onMove={board.updateCardPosition}
            onDelete={board.deleteCard}
            onConnect={board.startConnection}
          />
        ))}

        {/* Empty state */}
        {board.cards.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center space-y-3">
              <p className="font-detective text-3xl text-foreground/20">Caso em aberto</p>
              <p className="text-sm text-muted-foreground/40 font-typewriter">
                Clique em "+ Adicionar" para começar a investigação
              </p>
              <div className="flex justify-center gap-4 mt-4 text-muted-foreground/20">
                <span className="text-xs font-typewriter">📌 Suspeitos</span>
                <span className="text-xs font-typewriter">🔍 Provas</span>
                <span className="text-xs font-typewriter">💡 Teorias</span>
                <span className="text-xs font-typewriter">🕐 Horários</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

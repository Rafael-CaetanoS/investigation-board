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
        {/* Dark overlay for mood */}
        <div className="absolute inset-0 bg-background/40 pointer-events-none" />

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
            <div className="text-center">
              <p className="font-detective text-2xl text-foreground/30 mb-2">Caso em aberto</p>
              <p className="text-sm text-muted-foreground/50 font-typewriter">
                Clique em "Adicionar" para começar a investigação
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

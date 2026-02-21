import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBoard } from '@/hooks/useBoard';
import BoardCardComponent from './BoardCardComponent';
import ConnectionLines from './ConnectionLines';
import BoardToolbar from './BoardToolbar';
import SpeculationPanel from './SpeculationPanel';
import TimelineBar from './TimelineBar';
import corkTexture from '@/assets/cork-texture.jpg';

export default function InvestigationBoard() {
  const board = useBoard();
  const navigate = useNavigate();

  // Load case name from localStorage
  useEffect(() => {
    const name = localStorage.getItem('active-case-name');
    if (name && board.caseName === 'Caso Sem Nome') {
      board.setCaseName(name);
    }
  }, []);

  const handleReset = () => {
    board.resetBoard();
    navigate('/');
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-background">
      <BoardToolbar
        caseName={board.caseName}
        onCaseNameChange={board.setCaseName}
        onAdd={board.addCard}
        onReset={handleReset}
        isConnecting={board.connectingFrom !== null}
        onCancelConnection={board.cancelConnection}
        cardCount={board.cards.length}
        connectionCount={board.connections.length}
        connectionColor={board.connectionColor}
        onConnectionColorChange={board.setConnectionColor}
      />

      {/* Board */}
      <div
        className="flex-1 relative overflow-auto board-texture"
        style={{
          backgroundImage: `url(${corkTexture})`,
          backgroundSize: '512px 512px',
          backgroundRepeat: 'repeat',
          marginTop: board.connectingFrom ? 76 : 44,
          marginBottom: 44,
        }}
      >
        {/* Overlays */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(180deg, rgba(20,14,10,0.5) 0%, rgba(20,14,10,0.2) 50%, rgba(20,14,10,0.55) 100%)'
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(10,6,4,0.6) 100%)'
        }} />

        <div className="relative" style={{ minHeight: '200vh', minWidth: '200vw' }}>
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

          {board.cards.length === 0 && (
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 pointer-events-none text-center">
              <div className="space-y-3">
                <div className="text-5xl opacity-10">🔍</div>
                <p className="font-display text-xl text-foreground/15 tracking-wide">Mural vazio</p>
                <p className="text-xs text-muted-foreground/30 font-typewriter max-w-xs mx-auto">
                  Adicione suspeitos, provas, teorias e horários para começar a investigação.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <SpeculationPanel
        speculations={board.speculations}
        onAdd={board.addSpeculation}
        onToggle={board.toggleSpeculation}
        onDelete={board.deleteSpeculation}
      />

      <TimelineBar
        events={board.timeline}
        onAdd={board.addTimelineEvent}
        onDelete={board.deleteTimelineEvent}
      />
    </div>
  );
}

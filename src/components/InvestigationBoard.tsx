import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
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
        className="flex-1 relative overflow-auto"
        style={{
          backgroundImage: `url(${corkTexture})`,
          backgroundSize: '512px 512px',
          backgroundRepeat: 'repeat',
          marginTop: board.connectingFrom ? 76 : 48,
          marginBottom: 44,
        }}
      >
        {/* Dark overlays */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.75) 100%)'
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.6) 100%)'
        }} />
        {/* Subtle red ambient */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(180,20,20,0.03) 0%, transparent 60%)'
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
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full border border-primary/10 flex items-center justify-center mx-auto">
                  <Search size={24} className="text-primary/15" />
                </div>
                <p className="font-display text-xl text-foreground/10 tracking-wide">Mural vazio</p>
                <p className="text-[11px] text-muted-foreground/20 font-typewriter max-w-xs mx-auto">
                  Adicione suspeitos, provas e teorias para começar.
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

import { useBoard } from '@/hooks/useBoard';
import BoardCardComponent from './BoardCardComponent';
import ConnectionLines from './ConnectionLines';
import BoardToolbar from './BoardToolbar';
import SpeculationPanel from './SpeculationPanel';
import TimelineBar from './TimelineBar';
import corkTexture from '@/assets/cork-texture.jpg';

export default function InvestigationBoard() {
  const board = useBoard();

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <BoardToolbar
        caseName={board.caseName}
        onCaseNameChange={board.setCaseName}
        onAdd={board.addCard}
        onReset={board.resetBoard}
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
        {/* Dark overlay for depth */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(180deg, rgba(20,14,10,0.45) 0%, rgba(20,14,10,0.25) 50%, rgba(20,14,10,0.5) 100%)'
        }} />
        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(10,6,4,0.6) 100%)'
        }} />

        {/* Content area - taller for scrolling */}
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

          {/* Empty state */}
          {board.cards.length === 0 && (
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 pointer-events-none text-center">
              <div className="space-y-4">
                <div className="text-6xl opacity-10">🔍</div>
                <p className="font-display text-2xl text-foreground/15 tracking-wide">Caso em aberto</p>
                <p className="text-xs text-muted-foreground/30 font-typewriter max-w-xs mx-auto leading-relaxed">
                  Adicione fichas de suspeitos, provas, teorias e horários. Conecte-as com linhas coloridas para visualizar as relações.
                </p>
                <div className="flex justify-center gap-6 mt-6">
                  {[
                    { emoji: '👤', label: 'Suspeitos', color: 'var(--suspect)' },
                    { emoji: '🔍', label: 'Provas', color: 'var(--evidence)' },
                    { emoji: '💡', label: 'Teorias', color: 'var(--theory)' },
                    { emoji: '🕐', label: 'Horários', color: 'var(--timeline-color)' },
                  ].map(item => (
                    <div key={item.label} className="flex flex-col items-center gap-1">
                      <span className="text-lg">{item.emoji}</span>
                      <span className="text-[9px] font-detective tracking-wider" style={{ color: `hsl(${item.color})`, opacity: 0.4 }}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Side panels */}
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

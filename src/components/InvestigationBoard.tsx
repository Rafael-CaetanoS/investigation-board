import { useEffect } from 'react';
import { Search } from 'lucide-react';
import { useBoard } from '@/hooks/useBoard';
import BoardCardComponent from './BoardCardComponent';
import ConnectionLines from './ConnectionLines';
import BoardToolbar from './BoardToolbar';
import SpeculationPanel from './SpeculationPanel';
import TimelineBar from './TimelineBar';
import heroBg from '@/assets/hero-bg.jpg';
import { useState } from 'react';
import CaseReader from './CaseReader';

export default function InvestigationBoard() {
  const board = useBoard();
  const [caseReaderOpen, setCaseReaderOpen] = useState(false);
  const [viewport, setViewport] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const name = localStorage.getItem('active-case-name');
    if (name && board.caseName === 'Caso Sem Nome') {
      board.setCaseName(name);
    }
  }, []);

  const handleReset = () => {
    // Clear the board state without navigating away
    board.resetBoard();
  };

  useEffect(() => {
    const handleResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Create a fixed background element so the image stays centered and
  // visible regardless of horizontal/vertical scrolling. Cleanup on unmount.
  useEffect(() => {
    // image element ensures the asset is loaded and stays centered across wide pages
    const imgEl = document.createElement('img');
    imgEl.id = 'investigation-bg-img';
    imgEl.src = heroBg;
    Object.assign(imgEl.style, {
      position: 'fixed',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      minWidth: '100%',
      minHeight: '100%',
      width: 'auto',
      height: 'auto',
      objectFit: 'cover',
      zIndex: '-9999',
      pointerEvents: 'none',
      userSelect: 'none'
    } as CSSStyleDeclaration);

    // overlay for the dark gradient
    const overlay = document.createElement('div');
    overlay.id = 'investigation-bg-overlay';
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0px',
      zIndex: '-9998',
      pointerEvents: 'none',
      background: 'linear-gradient(rgba(6,6,8,0.55), rgba(6,6,8,0.6))'
    } as CSSStyleDeclaration);

    document.body.appendChild(imgEl);
    document.body.appendChild(overlay);
    return () => {
      if (imgEl.parentNode) imgEl.parentNode.removeChild(imgEl);
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'transparent' }}>
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
        onOpenCaseReader={() => setCaseReaderOpen(true)}
      />

      {/* Board: outer clipper hides native scrollbars; inner scroller handles scrolling */}
      <div className="relative">
        <div
          className="board-scroller"
          style={{
            overflow: 'visible',
            marginTop: board.connectingFrom ? 76 : 48,
            marginBottom: 44,
            background: 'transparent'
          }}
        >
          {/* Softer overlay and subtle grain to improve contrast (reduced opacity) */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.12) 40%, rgba(0,0,0,0.22) 100%)'
          }} />
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(ellipse at 50% 20%, rgba(255,255,255,0.02) 0%, transparent 40%)',
            mixBlendMode: 'overlay',
            opacity: 0.9
          }} />
          {/* Subtle vignette (lighter) */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.25) 100%)'
          }} />

          <div
            data-board-container
            className="relative"
            style={{
              minHeight: (() => {
                const vpH = (viewport.h || (typeof window !== 'undefined' ? window.innerHeight : 800));
                // allow scrolling ~15x a viewport height
                const minViewportMultiplier = 15;
                const defaultH = vpH * minViewportMultiplier;
                const maxY = board.cards.length ? Math.max(...board.cards.map(c => c.y)) : 0;
                const cardH = 260;
                const minCards = 9; // keep previous safeguard
                const minHeightForNine = minCards * cardH + 200;
                // ensure we can scroll well past last card and at least 15 viewports tall
                return Math.max(defaultH, maxY + cardH + 200, minHeightForNine) + 'px';
              })(),
              minWidth: (() => {
                const defaultW = (viewport.w || (typeof window !== 'undefined' ? window.innerWidth : 1200)) * 2;
                const maxX = board.cards.length ? Math.max(...board.cards.map(c => c.x)) : 0;
                const cardW = 320;
                return Math.max(defaultW, maxX + cardW + 200) + 'px';
              })(),
              paddingRight: 24,
              paddingBottom: 24,
              marginRight: -24,
              marginBottom: -24
            }}
          >
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

            <ConnectionLines
              connections={board.connections}
              cards={board.cards}
              onDeleteConnection={board.deleteConnection}
            />

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
      </div>

      <CaseReader open={caseReaderOpen} onOpenChange={setCaseReaderOpen} caseId={localStorage.getItem('active-case-id')} />

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

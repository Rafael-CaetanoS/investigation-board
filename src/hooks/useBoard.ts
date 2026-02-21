import { useState, useCallback, useEffect } from 'react';
import { BoardCard, Connection, BoardState, CardType, ConnectionColor, TimelineEvent, Speculation } from '@/types/board';

const STORAGE_KEY = 'investigation-board-v2';

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

function defaultState(): BoardState {
  return { cards: [], connections: [], timeline: [], speculations: [], caseName: 'Caso Sem Nome' };
}

function loadState(): BoardState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...defaultState(), ...parsed };
    }
  } catch {}
  return defaultState();
}

function saveState(state: BoardState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useBoard() {
  const [state, setState] = useState<BoardState>(loadState);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [connectionColor, setConnectionColor] = useState<ConnectionColor>('red');

  useEffect(() => {
    saveState(state);
  }, [state]);

  const { cards, connections, timeline, speculations, caseName } = state;

  // Cards
  const addCard = useCallback((type: CardType, title: string, description: string, imageUrl?: string) => {
    setState(prev => ({
      ...prev,
      cards: [...prev.cards, {
        id: generateId(), type, title, description, imageUrl,
        x: 150 + Math.random() * 500,
        y: 100 + Math.random() * 300,
      }],
    }));
  }, []);

  const updateCardPosition = useCallback((id: string, x: number, y: number) => {
    setState(prev => ({
      ...prev,
      cards: prev.cards.map(c => c.id === id ? { ...c, x, y } : c),
    }));
  }, []);

  const deleteCard = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      cards: prev.cards.filter(c => c.id !== id),
      connections: prev.connections.filter(c => c.fromId !== id && c.toId !== id),
    }));
  }, []);

  // Connections
  const startConnection = useCallback((cardId: string) => {
    if (connectingFrom === null) {
      setConnectingFrom(cardId);
    } else if (connectingFrom !== cardId) {
      const exists = connections.some(
        c => (c.fromId === connectingFrom && c.toId === cardId) ||
             (c.fromId === cardId && c.toId === connectingFrom)
      );
      if (!exists) {
        setState(prev => ({
          ...prev,
          connections: [...prev.connections, {
            id: generateId(), fromId: connectingFrom, toId: cardId, color: connectionColor,
          }],
        }));
      }
      setConnectingFrom(null);
    } else {
      setConnectingFrom(null);
    }
  }, [connectingFrom, connections, connectionColor]);

  const deleteConnection = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      connections: prev.connections.filter(c => c.id !== id),
    }));
  }, []);

  // Timeline
  const addTimelineEvent = useCallback((time: string, description: string) => {
    const toMinutes = (t: string) => {
      try {
        const parts = t.split(':');
        if (parts.length < 2) return Number.MAX_SAFE_INTEGER;
        const hh = parseInt(parts[0], 10);
        const mm = parseInt(parts[1], 10);
        if (Number.isNaN(hh) || Number.isNaN(mm)) return Number.MAX_SAFE_INTEGER;
        return hh * 60 + mm;
      } catch {
        return Number.MAX_SAFE_INTEGER;
      }
    };

    setState(prev => ({
      ...prev,
      timeline: [...prev.timeline, { id: generateId(), time, description }]
        .sort((a, b) => toMinutes(a.time) - toMinutes(b.time)),
    }));
  }, []);

  const deleteTimelineEvent = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      timeline: prev.timeline.filter(e => e.id !== id),
    }));
  }, []);

  // Speculations
  const addSpeculation = useCallback((text: string) => {
    setState(prev => ({
      ...prev,
      speculations: [{ id: generateId(), text, createdAt: Date.now() }, ...prev.speculations],
    }));
  }, []);

  const toggleSpeculation = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      speculations: prev.speculations.map(s => s.id === id ? { ...s, resolved: !s.resolved } : s),
    }));
  }, []);

  const deleteSpeculation = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      speculations: prev.speculations.filter(s => s.id !== id),
    }));
  }, []);

  // Case management
  const setCaseName = useCallback((name: string) => {
    setState(prev => ({ ...prev, caseName: name }));
  }, []);

  const resetBoard = useCallback(() => {
    const def = defaultState();
    setState(def);
    // remove persisted state so new mounts load fresh
    try { localStorage.removeItem(STORAGE_KEY); localStorage.removeItem('active-case-name'); } catch {}
    // ensure persistence reflects reset immediately
    try { saveState(def); } catch {}
    setConnectingFrom(null);
  }, []);

  return {
    cards, connections, timeline, speculations, caseName,
    connectingFrom, connectionColor, setConnectionColor,
    addCard, updateCardPosition, deleteCard,
    startConnection, cancelConnection: () => setConnectingFrom(null), deleteConnection,
    addTimelineEvent, deleteTimelineEvent,
    addSpeculation, toggleSpeculation, deleteSpeculation,
    setCaseName, resetBoard,
  };
}

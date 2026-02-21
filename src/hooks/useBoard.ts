import { useState, useCallback, useEffect } from 'react';
import { BoardCard, Connection, BoardState, CardType } from '@/types/board';

const STORAGE_KEY = 'investigation-board';

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

function loadState(): BoardState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return { cards: [], connections: [] };
}

function saveState(state: BoardState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useBoard() {
  const [cards, setCards] = useState<BoardCard[]>(() => loadState().cards);
  const [connections, setConnections] = useState<Connection[]>(() => loadState().connections);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);

  useEffect(() => {
    saveState({ cards, connections });
  }, [cards, connections]);

  const addCard = useCallback((type: CardType, title: string, description: string) => {
    const newCard: BoardCard = {
      id: generateId(),
      type,
      title,
      description,
      x: 100 + Math.random() * 400,
      y: 100 + Math.random() * 300,
    };
    setCards(prev => [...prev, newCard]);
  }, []);

  const updateCardPosition = useCallback((id: string, x: number, y: number) => {
    setCards(prev => prev.map(c => c.id === id ? { ...c, x, y } : c));
  }, []);

  const updateCard = useCallback((id: string, updates: Partial<BoardCard>) => {
    setCards(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, []);

  const deleteCard = useCallback((id: string) => {
    setCards(prev => prev.filter(c => c.id !== id));
    setConnections(prev => prev.filter(c => c.fromId !== id && c.toId !== id));
  }, []);

  const startConnection = useCallback((cardId: string) => {
    if (connectingFrom === null) {
      setConnectingFrom(cardId);
    } else if (connectingFrom !== cardId) {
      const exists = connections.some(
        c => (c.fromId === connectingFrom && c.toId === cardId) ||
             (c.fromId === cardId && c.toId === connectingFrom)
      );
      if (!exists) {
        setConnections(prev => [...prev, {
          id: generateId(),
          fromId: connectingFrom,
          toId: cardId,
        }]);
      }
      setConnectingFrom(null);
    } else {
      setConnectingFrom(null);
    }
  }, [connectingFrom, connections]);

  const deleteConnection = useCallback((id: string) => {
    setConnections(prev => prev.filter(c => c.id !== id));
  }, []);

  const clearBoard = useCallback(() => {
    setCards([]);
    setConnections([]);
  }, []);

  return {
    cards,
    connections,
    connectingFrom,
    addCard,
    updateCardPosition,
    updateCard,
    deleteCard,
    startConnection,
    cancelConnection: () => setConnectingFrom(null),
    deleteConnection,
    clearBoard,
  };
}

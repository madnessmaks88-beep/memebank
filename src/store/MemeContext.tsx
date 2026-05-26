import React, { createContext, useContext, useState, useCallback } from 'react';
import { Meme, TabId, AppState } from '../types';

const initialState: Meme[] = [
  {
    id: '1', title: 'Когда сессия близко', author: 'Студент ВК',
    authorAvatar: 'https://placehold.co/40/FF3D71/fff?text=С',
    image: 'https://placehold.co/400x250/16161D/00E5FF?text=Сессия',
    tags: ['учеба', 'жиза'], uses: 124, coins: 45, createdAt: Date.now()
  },
  {
    id: '2', title: 'Код заработал с первого раза', author: 'Dev_Rofl',
    authorAvatar: 'https://placehold.co/40/FFD700/000?text=D',
    image: 'https://placehold.co/400x250/16161D/FF3D71?text=Код',
    tags: ['dev', 'баг'], uses: 215, coins: 78, createdAt: Date.now()
  }
];

const MemeContext = createContext<AppState | null>(null);

export const MemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [memes, setMemes] = useState<Meme[]>(initialState);
  const [coins, setCoins] = useState<number>(150);
  const [activeTab, setActiveTab] = useState<TabId>('feed');

  const addMeme = useCallback((data: Omit<Meme, 'id' | 'uses' | 'coins' | 'createdAt'>) => {
    const newMeme: Meme = {
      ...data,
      id: crypto.randomUUID(),
      uses: 0,
      coins: 1,
      createdAt: Date.now()
    };
    setMemes(prev => [newMeme, ...prev]);
    setCoins(prev => prev + 1);
  }, []);

  const incrementUse = useCallback((id: string) => {
    setMemes(prev => prev.map(m => m.id === id ? { ...m, uses: m.uses + 1 } : m));
    // В реальном приложении здесь запрос к бэкенду для начисления монет автору
  }, []);

  return (
    <MemeContext.Provider value={{ memes, coins, activeTab, setActiveTab, addMeme, incrementUse }}>
      {children}
    </MemeContext.Provider>
  );
};

export const useMemeStore = () => {
  const ctx = useContext(MemeContext);
  if (!ctx) throw new Error('useMemeStore must be used inside MemeProvider');
  return ctx;
};
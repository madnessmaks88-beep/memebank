export interface Meme {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  image: string;
  tags: string[];
  uses: number;
  coins: number;
  createdAt: number;
}

export type TabId = 'feed' | 'upload' | 'wallet' | 'profile';

export interface AppState {
  memes: Meme[];
  coins: number;
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  addMeme: (meme: Omit<Meme, 'id' | 'uses' | 'coins' | 'createdAt'>) => void;
  incrementUse: (id: string) => void;
}
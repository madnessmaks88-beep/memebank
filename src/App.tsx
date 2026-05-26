import React, { useState } from 'react';
import { AppRoot } from '@vkontakte/vkui';
import { useVKAuth } from './hooks/useVKAuth';
import { Feed } from './pages/Feed';
import { Upload } from './pages/Upload';
import { Wallet } from './pages/Wallet';

export const App: React.FC = () => {
  const { loading, error } = useVKAuth();
  const [activePanel, setActivePanel] = useState('feed');

  if (loading) {
    return (
      <AppRoot>
        <div style={{ background: '#0B0B0F', minHeight: '100vh', display: 'grid', placeItems: 'center', color: '#fff' }}>
          <div>⏳ Загрузка...</div>
        </div>
      </AppRoot>
    );
  }

  if (error) {
    return (
      <AppRoot>
        <div style={{ background: '#0B0B0F', color: '#fff', padding: 40, textAlign: 'center', minHeight: '100vh' }}>
          <h3>⚠️ Ошибка</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} style={{ marginTop: 20, padding: '10px 20px', background: '#00E5FF', border: 'none', borderRadius: 8 }}>
            🔄 Обновить
          </button>
        </div>
      </AppRoot>
    );
  }

  return (
    <AppRoot>
      {/* Основной контент */}
      <div style={{ 
        background: '#0B0B0F', 
        minHeight: '100vh', 
        paddingBottom: '70px' // Место под меню
      }}>
        {activePanel === 'feed' && <Feed />}
        {activePanel === 'upload' && <Upload />}
        {activePanel === 'wallet' && <Wallet />}
      </div>

      {/* Нижнее меню */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60px',
        background: '#18181b',
        borderTop: '1px solid #27272a',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 1000,
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}>
        <div onClick={() => setActivePanel('feed')} style={{ textAlign: 'center', color: activePanel === 'feed' ? '#00E5FF' : '#71717a', cursor: 'pointer', width: '33%' }}>
          <div style={{ fontSize: 24 }}>🏠</div>
          <div style={{ fontSize: 10 }}>Лента</div>
        </div>
        <div onClick={() => setActivePanel('upload')} style={{ textAlign: 'center', color: activePanel === 'upload' ? '#00E5FF' : '#71717a', cursor: 'pointer', width: '33%' }}>
          <div style={{ fontSize: 24 }}>➕</div>
          <div style={{ fontSize: 10 }}>Загрузить</div>
        </div>
        <div onClick={() => setActivePanel('wallet')} style={{ textAlign: 'center', color: activePanel === 'wallet' ? '#00E5FF' : '#71717a', cursor: 'pointer', width: '33%' }}>
          <div style={{ fontSize: 24 }}>💰</div>
          <div style={{ fontSize: 10 }}>Кошелёк</div>
        </div>
      </div>
    </AppRoot>
  );
};
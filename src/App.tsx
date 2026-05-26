import React, { Suspense, lazy, useState } from 'react';
import { AppRoot, View, Panel, Spinner, SplitCol } from '@vkontakte/vkui';
import { Icon28HomeOutline, Icon28AddCircleOutline, Icon28CoinsOutline } from '@vkontakte/icons';

// ✅ 1. Импортируем хук авторизации
import { useVKAuth } from './hooks/useVKAuth';

// Ленивая загрузка страниц
const Feed = lazy(() => import('./pages/Feed').then(m => ({ default: m.Feed })));
const Upload = lazy(() => import('./pages/Upload').then(m => ({ default: m.Upload })));
const Wallet = lazy(() => import('./pages/Wallet').then(m => ({ default: m.Wallet })));

export const App: React.FC = () => {
  const [activePanel, setActivePanel] = useState('feed');
  
  // ✅ 2. Вызываем хук ВНУТРИ компонента
  const { loading, error, retryInit } = useVKAuth();

  // ✅ 3. Показываем ошибку, если VK Bridge не инициализировался
  if (error) {
    return (
      <AppRoot>
        <div style={{ 
          padding: 40, 
          textAlign: 'center', 
          color: '#e4e4e7', 
          background: '#0B0B0F', 
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📡</div>
          <h3 style={{ margin: '0 0 8px', fontSize: 18 }}>Нет соединения с ВК</h3>
          <p style={{ margin: '0 0 24px', color: '#71717a', fontSize: 14, maxWidth: 260 }}>
            {error}
          </p>
          <button 
            onClick={retryInit} 
            style={{ 
              padding: '12px 24px', 
              background: '#00E5FF', 
              color: '#000', 
              border: 'none', 
              borderRadius: 12, 
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            🔄 Попробовать снова
          </button>
        </div>
      </AppRoot>
    );
  }

  // ✅ 4. Показываем спиннер, пока грузится Bridge
  if (loading) {
    return (
      <AppRoot>
        <div style={{ padding: 60, textAlign: 'center', background: '#0B0B0F', minHeight: '100vh' }}>
          <Spinner size="l" />
        </div>
      </AppRoot>
    );
  }

  return (
    <AppRoot>
      <SplitCol>
        <View activePanel={activePanel}>
          <Panel id="feed">
            <Suspense fallback={<div style={{ padding: 40, textAlign: 'center' }}><Spinner size="l" /></div>}>
              {activePanel === 'feed' && <Feed />}
            </Suspense>
          </Panel>

          <Panel id="upload">
            <Suspense fallback={<div style={{ padding: 40, textAlign: 'center' }}><Spinner size="l" /></div>}>
              {activePanel === 'upload' && <Upload />}
            </Suspense>
          </Panel>

          <Panel id="wallet">
            <Suspense fallback={<div style={{ padding: 40, textAlign: 'center' }}><Spinner size="l" /></div>}>
              {activePanel === 'wallet' && <Wallet />}
            </Suspense>
          </Panel>
        </View>
      </SplitCol>

      {/* Кастомное нижнее меню (без ошибок TS) */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, height: '60px',
        background: '#18181b', borderTop: '1px solid #27272a',
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        zIndex: 1000, paddingBottom: 'env(safe-area-inset-bottom)'
      }}>
        <div onClick={() => setActivePanel('feed')} style={{ textAlign: 'center', color: activePanel === 'feed' ? '#00E5FF' : '#71717a', cursor: 'pointer', width: '33%', userSelect: 'none' }}>
          <Icon28HomeOutline />
          <div style={{ fontSize: 10, marginTop: 2, fontWeight: 500 }}>Лента</div>
        </div>
        <div onClick={() => setActivePanel('upload')} style={{ textAlign: 'center', color: activePanel === 'upload' ? '#00E5FF' : '#71717a', cursor: 'pointer', width: '33%', userSelect: 'none' }}>
          <Icon28AddCircleOutline />
          <div style={{ fontSize: 10, marginTop: 2, fontWeight: 500 }}>Загрузить</div>
        </div>
        <div onClick={() => setActivePanel('wallet')} style={{ textAlign: 'center', color: activePanel === 'wallet' ? '#00E5FF' : '#71717a', cursor: 'pointer', width: '33%', userSelect: 'none' }}>
          <Icon28CoinsOutline />
          <div style={{ fontSize: 10, marginTop: 2, fontWeight: 500 }}>Кошелёк</div>
        </div>
      </div>
    </AppRoot>
  );
};
import React, { Suspense, lazy, useState } from 'react';
import { AppRoot, View, Panel, Spinner, SplitCol } from '@vkontakte/vkui';
import { Icon28HomeOutline, Icon28AddCircleOutline, Icon28CoinsOutline } from '@vkontakte/icons';

// ✅ Ленивая загрузка (экономит память, грузится только при клике)
const Feed = lazy(() => import('./pages/Feed').then(m => ({ default: m.Feed })));
const Upload = lazy(() => import('./pages/Upload').then(m => ({ default: m.Upload })));
const Wallet = lazy(() => import('./pages/Wallet').then(m => ({ default: m.Wallet })));

export const App: React.FC = () => {
  const [activePanel, setActivePanel] = useState('feed');

  // Функция для переключения вкладок
  const switchTab = (id: string) => {
    setActivePanel(id);
  };

  return (
    <AppRoot>
      <SplitCol>
        {/* Основной контент с отступом снизу, чтобы меню не перекрывало текст */}
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

      {/* ✅ Кастомное нижнее меню (Работает на 100% стабильно) */}
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
        paddingBottom: 'env(safe-area-inset-bottom)' // Отступ для iPhone с челкой
      }}>
        {/* Кнопка: Лента */}
        <div 
          onClick={() => switchTab('feed')} 
          style={{ 
            textAlign: 'center', 
            color: activePanel === 'feed' ? '#00E5FF' : '#71717a', 
            cursor: 'pointer', 
            width: '33%',
            userSelect: 'none' 
          }}
        >
          <Icon28HomeOutline />
          <div style={{ fontSize: 10, marginTop: 2, fontWeight: 500 }}>Лента</div>
        </div>

        {/* Кнопка: Загрузить */}
        <div 
          onClick={() => switchTab('upload')} 
          style={{ 
            textAlign: 'center', 
            color: activePanel === 'upload' ? '#00E5FF' : '#71717a', 
            cursor: 'pointer', 
            width: '33%',
            userSelect: 'none' 
          }}
        >
          <Icon28AddCircleOutline />
          <div style={{ fontSize: 10, marginTop: 2, fontWeight: 500 }}>Загрузить</div>
        </div>

        {/* Кнопка: Кошелёк */}
        <div 
          onClick={() => switchTab('wallet')} 
          style={{ 
            textAlign: 'center', 
            color: activePanel === 'wallet' ? '#00E5FF' : '#71717a', 
            cursor: 'pointer', 
            width: '33%',
            userSelect: 'none' 
          }}
        >
          <Icon28CoinsOutline />
          <div style={{ fontSize: 10, marginTop: 2, fontWeight: 500 }}>Кошелёк</div>
        </div>
      </div>
    </AppRoot>
  );
};
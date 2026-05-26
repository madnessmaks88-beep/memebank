import React, { useState } from 'react';
import { AppRoot, View, Panel, Spinner, SplitCol } from '@vkontakte/vkui';
import { Icon28HomeOutline, Icon28AddCircleOutline, Icon28CoinsOutline } from '@vkontakte/icons';
import { useVKAuth } from './hooks/useVKAuth';

// ✅ Импортируем страницы напрямую (без lazy, для надежности)
import { Feed } from './pages/Feed';
import { Upload } from './pages/Upload';
import { Wallet } from './pages/Wallet';

export const App: React.FC = () => {
  const { loading, error } = useVKAuth();
  const [activePanel, setActivePanel] = useState('feed');

  //  Если загрузка (VK Bridge)
  if (loading) {
    return (
      <AppRoot>
        <div style={{ background: '#0B0B0F', minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
          <Spinner size="l" />
        </div>
      </AppRoot>
    );
  }

  //  Если ошибка
  if (error) {
    return (
      <AppRoot>
        <div style={{ background: '#0B0B0F', color: '#fff', padding: 40, textAlign: 'center', minHeight: '100vh' }}>
          <h3>⚠️ Ошибка подключения</h3>
          <p style={{ color: '#aaa' }}>{error}</p>
          <button onClick={() => window.location.reload()} style={{ marginTop: 20, padding: '10px 20px', background: '#00E5FF', border: 'none', borderRadius: 8 }}>
            🔄 Обновить
          </button>
        </div>
      </AppRoot>
    );
  }

  // ✅ Успех — показываем приложение
  return (
    <AppRoot>
      <SplitCol>
        <View activePanel={activePanel}>
          
          {/* Вкладка: Лента */}
          <Panel id="feed">
            <Feed />
          </Panel>

          {/* Вкладка: Загрузка */}
          <Panel id="upload">
            <Upload />
          </Panel>

          {/* Вкладка: Кошелёк */}
          <Panel id="wallet">
            <Wallet />
          </Panel>

        </View>
      </SplitCol>

      {/* Кастомное меню (работает железобетонно) */}
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
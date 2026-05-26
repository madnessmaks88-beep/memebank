import React, { useState } from 'react';
import { AppRoot, View, Panel, SplitCol, Group } from '@vkontakte/vkui';
import { Icon28HomeOutline, Icon28AddCircleOutline, Icon28CoinsOutline, Icon28UserOutline } from '@vkontakte/icons';
import { useVKAuth } from './hooks/useVKAuth';
import { Feed } from './pages/Feed';
import { Upload } from './pages/Upload';
import { Wallet } from './pages/Wallet';
import { Profile } from './pages/Profile';

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
      <SplitCol>
        <View activePanel={activePanel}>
          
          <Panel id="feed">
            <Group style={{ padding: 0 }}>
              <Feed />
            </Group>
          </Panel>

          <Panel id="upload">
            <Group style={{ padding: 0 }}>
              <Upload />
            </Group>
          </Panel>

          <Panel id="wallet">
            <Group style={{ padding: 0 }}>
              <Wallet />
            </Group>
          </Panel>

          <Panel id="profile">
            <Group style={{ padding: 0 }}>
              <Profile />
            </Group>
          </Panel>

        </View>
      </SplitCol>

      {/* Нижнее меню с 4 вкладками */}
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
        <div onClick={() => setActivePanel('feed')} style={{ textAlign: 'center', color: activePanel === 'feed' ? '#00E5FF' : '#71717a', cursor: 'pointer', width: '25%', userSelect: 'none' }}>
          <Icon28HomeOutline width={28} height={28} />
          <div style={{ fontSize: 10, marginTop: 2, fontWeight: 500 }}>Лента</div>
        </div>
        <div onClick={() => setActivePanel('upload')} style={{ textAlign: 'center', color: activePanel === 'upload' ? '#00E5FF' : '#71717a', cursor: 'pointer', width: '25%', userSelect: 'none' }}>
          <Icon28AddCircleOutline width={28} height={28} />
          <div style={{ fontSize: 10, marginTop: 2, fontWeight: 500 }}>Загрузить</div>
        </div>
        <div onClick={() => setActivePanel('wallet')} style={{ textAlign: 'center', color: activePanel === 'wallet' ? '#00E5FF' : '#71717a', cursor: 'pointer', width: '25%', userSelect: 'none' }}>
          <Icon28CoinsOutline width={28} height={28} />
          <div style={{ fontSize: 10, marginTop: 2, fontWeight: 500 }}>Кошелёк</div>
        </div>
        <div onClick={() => setActivePanel('profile')} style={{ textAlign: 'center', color: activePanel === 'profile' ? '#00E5FF' : '#71717a', cursor: 'pointer', width: '25%', userSelect: 'none' }}>
          <Icon28UserOutline width={28} height={28} />
          <div style={{ fontSize: 10, marginTop: 2, fontWeight: 500 }}>Профиль</div>
        </div>
      </div>
    </AppRoot>
  );
};
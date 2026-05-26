import React, { useState } from 'react';
import { AppRoot } from '@vkontakte/vkui';
import { useVKAuth } from './hooks/useVKAuth';

export const App: React.FC = () => {
  const { loading, error, user } = useVKAuth();
  const [activePanel, setActivePanel] = useState('feed');

  console.log('[App] State:', { loading, error, user, activePanel });

  if (error) {
    return (
      <AppRoot>
        <div style={{ padding: 40, background: '#000', color: '#fff' }}>
          <h2>❌ Ошибка VK Bridge</h2>
          <p style={{ color: '#ff6b6b' }}>{error}</p>
        </div>
      </AppRoot>
    );
  }

  if (loading) {
    return (
      <AppRoot>
        <div style={{ padding: 60, background: '#0B0B0F', color: '#fff', textAlign: 'center' }}>
          <h2>⏳ Инициализация...</h2>
          <p>Загрузка VK Bridge</p>
        </div>
      </AppRoot>
    );
  }

  return (
    <AppRoot>
      <div style={{ padding: 20, background: '#0B0B0F', color: '#fff', minHeight: '100vh' }}>
        <h1>✅ VK Bridge работает!</h1>
        <p>Пользователь: {user?.first_name} {user?.last_name}</p>
        <p>Active panel: {activePanel}</p>
        
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button onClick={() => setActivePanel('feed')} style={{ flex: 1, padding: 10 }}>Лента</button>
          <button onClick={() => setActivePanel('upload')} style={{ flex: 1, padding: 10 }}>Загрузить</button>
          <button onClick={() => setActivePanel('wallet')} style={{ flex: 1, padding: 10 }}>Кошелёк</button>
          <button onClick={() => setActivePanel('profile')} style={{ flex: 1, padding: 10 }}>Профиль</button>
        </div>

        <div style={{ marginTop: 30, padding: 20, background: '#18181b', borderRadius: 12 }}>
          <h3>📊 Диагностика:</h3>
          <pre style={{ fontSize: 12, color: '#aaa' }}>
            {JSON.stringify({ user, activePanel }, null, 2)}
          </pre>
        </div>
      </div>
    </AppRoot>
  );
};
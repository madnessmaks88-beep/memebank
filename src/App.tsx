import React from 'react';
import { AppRoot } from '@vkontakte/vkui';
import { useVKAuth } from './hooks/useVKAuth';

export const App: React.FC = () => {
  const { loading, error } = useVKAuth();

  console.log('[App] Render state:', { loading, error });

  if (error) {
    return (
      <AppRoot>
        <div style={{ 
          padding: 40, 
          background: '#000', 
          color: '#fff',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <h2>❌ Ошибка</h2>
          <p style={{ color: '#ff6b6b', wordBreak: 'break-all' }}>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{ 
              marginTop: 20, 
              padding: '12px 24px',
              background: '#00E5FF',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 16
            }}
          >
            🔄 Перезагрузить
          </button>
        </div>
      </AppRoot>
    );
  }

  if (loading) {
    return (
      <AppRoot>
        <div style={{ 
          padding: 60, 
          background: '#0B0B0F', 
          color: '#fff',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: 24, marginBottom: 16 }}>⏳ Загрузка...</div>
          <div style={{ color: '#71717a' }}>Инициализация VK Bridge</div>
        </div>
      </AppRoot>
    );
  }

  return (
    <AppRoot>
      <div style={{ 
        padding: 40, 
        background: '#0B0B0F', 
        color: '#fff',
        minHeight: '100vh'
      }}>
        <h1>✅ MemeBank работает!</h1>
        <div style={{ 
          marginTop: 30, 
          padding: 20, 
          background: '#18181b',
          borderRadius: 12,
          border: '1px solid #27272a'
        }}>
          <p style={{ margin: 0, color: '#aaa' }}>
            React и VKUI загрузились успешно.
          </p>
          <p style={{ margin: '10px 0 0', fontSize: 13, color: '#71717a' }}>
            Теперь нужно подключить страницы (Feed, Wallet, Upload).
          </p>
        </div>
      </div>
    </AppRoot>
  );
};
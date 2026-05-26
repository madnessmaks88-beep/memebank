import React from 'react';
import { AppRoot } from '@vkontakte/vkui';
import { useVKAuth } from './hooks/useVKAuth';

export const App: React.FC = () => {
  const { loading, error } = useVKAuth();

  if (error) {
    return (
      <AppRoot>
        <div style={{ padding: 40, background: '#000', color: '#fff', minHeight: '100vh' }}>
          <h2>❌ Ошибка</h2>
          <p style={{ color: '#ff6b6b' }}>{error}</p>
          <button onClick={() => window.location.reload()} style={{ marginTop: 20, padding: '12px 24px', background: '#00E5FF', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
            🔄 Перезагрузить
          </button>
        </div>
      </AppRoot>
    );
  }

  if (loading) {
    return (
      <AppRoot>
        <div style={{ padding: 60, background: '#0B0B0F', color: '#fff', minHeight: '100vh', textAlign: 'center' }}>
          <div style={{ fontSize: 24, marginBottom: 16 }}>⏳</div>
          <div>Загрузка...</div>
        </div>
      </AppRoot>
    );
  }

  // ✅ Успешная загрузка — показываем простой экран
  return (
    <AppRoot>
      <div style={{ 
        padding: 20, 
        background: '#0B0B0F', 
        color: '#fff',
        minHeight: '100vh'
      }}>
        <h1 style={{ marginBottom: 20 }}>🎉 MemeBank работает!</h1>
        
        <div style={{ 
          padding: 16, 
          background: '#18181b',
          borderRadius: 12,
          border: '1px solid #27272a',
          marginBottom: 20
        }}>
          <p style={{ margin: 0, color: '#00E5FF' }}>✅ VK Bridge подключён</p>
          <p style={{ margin: '8px 0 0', fontSize: 13, color: '#71717a' }}>
            Приложение инициализировано успешно.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button style={{ flex: 1, padding: 12, background: '#27272a', color: '#fff', border: 'none', borderRadius: 8 }}>
            Лента
          </button>
          <button style={{ flex: 1, padding: 12, background: '#27272a', color: '#fff', border: 'none', borderRadius: 8 }}>
            Кошелёк
          </button>
        </div>

        <p style={{ marginTop: 30, fontSize: 12, color: '#52525b' }}>
          Если ты видишь этот экран — React и VKUI работают. 
          Проблема была в компонентах Feed/Wallet/Upload.
        </p>
      </div>
    </AppRoot>
  );
};
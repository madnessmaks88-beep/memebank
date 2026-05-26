import React from 'react';
import { Group, Avatar, Cell, Button } from '@vkontakte/vkui';
import { Icon28UserOutline, Icon28SettingsOutline, Icon28InfoOutline } from '@vkontakte/icons';
import { useVKAuth } from '../hooks/useVKAuth';

export const Profile: React.FC = () => {
  const { user } = useVKAuth();

  return (
    <Group>
      <div style={{ padding: 20, textAlign: 'center', background: '#18181b', borderRadius: 16, marginBottom: 16 }}>
        <Avatar 
          size={96} 
          src={user?.photo_200 || user?.photo_100} 
          style={{ margin: '0 auto 16px' }}
        />
        <h2 style={{ margin: '0 0 8px', color: '#fff' }}>
          {user ? `${user.first_name} ${user.last_name}` : 'Гость'}
        </h2>
        <p style={{ margin: 0, color: '#71717a', fontSize: 14 }}>
          ID: {user?.id || 'Не авторизован'}
        </p>
      </div>
      
      <Cell 
        before={<Icon28UserOutline />}
        subtitle="Ваш профиль"
      >
        Статистика
      </Cell>
      
      <Cell 
        before={<Icon28SettingsOutline />}
        subtitle="Настройки приложения"
      >
        Настройки
      </Cell>
      
      <Cell 
        before={<Icon28InfoOutline />}
        subtitle="Версия 1.0.0"
      >
        О приложении
      </Cell>

      <Button 
        mode="secondary" 
        size="l"
        onClick={() => {
          if (confirm('Выйти из приложения?')) {
            window.location.reload();
          }
        }}
        style={{ marginTop: 24, width: '100%' }}
      >
        Выйти
      </Button>
    </Group>
  );
};
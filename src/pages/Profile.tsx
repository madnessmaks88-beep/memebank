import React from 'react';
import { Group } from '@vkontakte/vkui';

export const Profile: React.FC = () => (
  <Group>
    <div style={{ padding: '0 16px' }}>
      <div style={{ padding: '14px 0', borderBottom: '1px solid #2A2A35', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
        <span style={{ color: '#fff', fontSize: 16 }}>⚙️ Настройки аккаунта</span>
        <span style={{ color: '#9A9AB0', fontSize: 14 }}>Настройки</span>
      </div>
      <div style={{ padding: '14px 0', borderBottom: '1px solid #2A2A35', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
        <span style={{ color: '#fff', fontSize: 16 }}>❓ Поддержка</span>
        <span style={{ color: '#9A9AB0', fontSize: 14 }}>Помощь</span>
      </div>
      <div style={{ padding: '14px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
        <span style={{ color: '#fff', fontSize: 16 }}>ℹ️ О приложении</span>
        <span style={{ color: '#9A9AB0', fontSize: 14 }}>v0.1.0</span>
      </div>
    </div>
    
    <div style={{ padding: '20px 16px', textAlign: 'center', color: '#9A9AB0', fontSize: 13 }}>
      MemeBank © 2026. Скоро: достижения, сквады, AI-теги
    </div>
  </Group>
);
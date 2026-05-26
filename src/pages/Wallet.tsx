import React from 'react';
import { Group, Spinner, Button, Cell, Avatar } from '@vkontakte/vkui';
import { Icon28CoinsOutline } from '@vkontakte/icons';
import { useVKAuth } from '../hooks/useVKAuth';
import { useWallet } from '../hooks/useWallet';

export const Wallet: React.FC = () => {
  const { user } = useVKAuth();
  const { balance, history, loading, dailyClaimReady, claimBonus } = useWallet();

  if (loading) {
    return (
      <Group>
        <div style={{ padding: 60, textAlign: 'center' }}>
          <Spinner size="l" />
          <div style={{ marginTop: 20, color: '#71717a' }}>Загрузка кошелька...</div>
        </div>
      </Group>
    );
  }

  return (
    <Group>
      <div style={{ padding: 20, color: '#fff' }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <Avatar 
            size={80} 
            src={user?.photo_200 || user?.photo_100}
            style={{ margin: '0 auto 16px' }}
          />
          <h2 style={{ margin: '0 0 8px' }}>
            {user ? `${user.first_name} ${user.last_name}` : 'Гость'}
          </h2>
          
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: 8,
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #FFB800 0%, #FFD700 100%)',
            borderRadius: 16,
            marginTop: 16
          }}>
            <Icon28CoinsOutline width={28} height={28} />
            <span style={{ fontSize: 28, fontWeight: 'bold', color: '#000' }}>
              {balance}
            </span>
            <span style={{ fontSize: 14, color: '#000' }}>монет</span>
          </div>
        </div>

        {dailyClaimReady && (
          <Button 
            mode="primary" 
            size="l"
            onClick={claimBonus}
            style={{ width: '100%', marginBottom: 24 }}
          >
            🎁 Получить ежедневный бонус (+50)
          </Button>
        )}

        <h3 style={{ marginBottom: 16, color: '#f4f4f5' }}>📊 История транзакций</h3>
        
        {history.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#71717a' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
            <div>Пока нет транзакций</div>
          </div>
        ) : (
          history.map(txn => (
            <Cell 
              key={txn.id}
              before={txn.type === 'earn' ? <Icon28CoinsOutline /> : null}
              subtitle={new Date(txn.created_at).toLocaleDateString('ru-RU')}
            >
              <span style={{ color: txn.amount > 0 ? '#00E5FF' : '#FF3D71' }}>
                {txn.amount > 0 ? '+' : ''}{txn.amount} монет
              </span>
            </Cell>
          ))
        )}
      </div>
    </Group>
  );
};
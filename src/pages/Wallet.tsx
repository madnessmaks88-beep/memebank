import React from 'react';
import { Button, Spinner } from '@vkontakte/vkui';
import { useWallet } from '../hooks/useWallet';
import { RankCard } from '../components/RankCard';

const typeLabels: Record<string, { label: string; icon: string; color: string }> = {
  daily_bonus: { label: 'Ежедневный бонус', icon: '🎁', color: '#00E5FF' },
  upload: { label: 'Загрузка мема', icon: '', color: '#00E5FF' },
  like_reward: { label: 'Награда за лайк', icon: '❤️', color: '#FF3D71' },
};

export const Wallet: React.FC = () => {
  const { balance, history, loading, dailyClaimReady, claimBonus } = useWallet();

  const handleClaim = async () => {
    const success = await claimBonus();
    if (success) alert('🎉 +50 монет зачислено!');
  };

  if (loading) {
    return (
      <div style={{ padding: 60, textAlign: 'center', background: '#0B0B0F', height: '100vh' }}>
        <Spinner size="l" />
      </div>
    );
  }

  return (
    <div style={{ background: '#0B0B0F', minHeight: '100vh', color: '#e4e4e7' }}>
      
      {/* ✨ Красивая карточка ранга */}
      <RankCard balance={balance} />

      {/* Баланс (поменьше, так как ранг уже показывает статус) */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
         <div style={{ fontSize: 14, color: '#71717a', marginBottom: 4 }}>Всего заработано</div>
         <div style={{ fontSize: 32, fontWeight: 700, color: '#fff' }}>
           {balance} 💰
         </div>
         
         {dailyClaimReady && (
           <Button 
             mode="primary" 
             size="m" 
             onClick={handleClaim}
             style={{ marginTop: 12, background: '#27272a', color: '#FFB800', border: '1px solid #FFB800' }}
           >
             🎁 Забрать бонус (+50)
           </Button>
         )}
      </div>

      {/* История операций */}
      <div style={{ padding: '0 16px 40px' }}>
        <div style={{ color: '#71717a', fontSize: 14, marginBottom: 16, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          История операций
        </div>
        
        {history.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#52525b', padding: 32, background: '#18181b', borderRadius: 16 }}>
            Пока нет операций 📭
          </div>
        ) : (
          history.map(txn => {
            const info = typeLabels[txn.type] || { label: txn.type, icon: '🔄', color: '#a1a1aa' };
            return (
              <div 
                key={txn.id}
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '14px 16px', 
                  background: '#18181b', 
                  marginBottom: 10, 
                  borderRadius: 14,
                  border: '1px solid #27272a'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ fontSize: 22, width: 32, textAlign: 'center' }}>{info.icon}</div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#f4f4f5', fontSize: 15 }}>{info.label}</div>
                    <div style={{ fontSize: 12, color: '#71717a', marginTop: 2 }}>
                      {new Date(txn.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div style={{ color: info.color, fontWeight: 700, fontSize: 16 }}>
                  {txn.amount > 0 ? '+' : ''}{txn.amount}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
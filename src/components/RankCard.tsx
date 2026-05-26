import React from 'react';

interface RankProps {
  balance: number;
}

// Настройки уровней
const RANKS = [
  { level: 1, name: 'Новичок', min: 0, color: '#a1a1aa', icon: '🐣', gradient: 'linear-gradient(135deg, #52525b 0%, #27272a 100%)' },
  { level: 2, name: 'Мемолог', min: 100, color: '#00E5FF', icon: '🧐', gradient: 'linear-gradient(135deg, #00E5FF 0%, #0055ff 100%)' },
  { level: 3, name: 'Гуфи', min: 500, color: '#FFB800', icon: '😎', gradient: 'linear-gradient(135deg, #FFB800 0%, #ff5500 100%)' },
  { level: 4, name: 'Легенда', min: 2000, color: '#FF3D71', icon: '👑', gradient: 'linear-gradient(135deg, #FF3D71 0%, #8800ff 100%)' },
];

export const RankCard: React.FC<RankProps> = ({ balance }) => {
  // 1. Определяем текущий ранг
  const currentRank = [...RANKS].reverse().find(r => balance >= r.min) || RANKS[0];
  const nextRank = RANKS.find(r => r.min > balance);

  // 2. Формула прогресса (Сколько % до следующего уровня)
  const progress = nextRank 
    ? ((balance - currentRank.min) / (nextRank.min - currentRank.min)) * 100 
    : 100;

  return (
    <div style={{ 
      background: currentRank.gradient, 
      borderRadius: 24, 
      padding: 24, 
      margin: '16px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: `0 0 30px ${currentRank.color}33`, // Неоновое свечение
      border: `1px solid ${currentRank.color}44`
    }}>
      {/* Фоновый паттерн (декор) */}
      <div style={{ position: 'absolute', top: -20, right: -20, fontSize: 80, opacity: 0.2 }}>
        {currentRank.icon}
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Заголовок ранга */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.8, marginBottom: 4 }}>
              Твой статус
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
              {currentRank.icon} {currentRank.name}
            </div>
          </div>
          <div style={{ fontSize: 14, background: 'rgba(0,0,0,0.3)', padding: '6px 12px', borderRadius: 20, color: '#fff' }}>
            Lvl {currentRank.level}
          </div>
        </div>

        {/* Прогресс-бар */}
        {nextRank ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 8, color: 'rgba(255,255,255,0.8)' }}>
              <span>{balance} / {nextRank.min} 💰</span>
              <span>До {nextRank.name}</span>
            </div>
            <div style={{ height: 10, background: 'rgba(0,0,0,0.3)', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ 
                height: '100%', 
                width: `${Math.min(progress, 100)}%`, 
                background: '#fff', 
                borderRadius: 10,
                transition: 'width 0.5s ease-out',
                boxShadow: '0 0 10px #fff'
              }} />
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: '#fff', fontSize: 14, marginTop: 8 }}>
             🏆 Максимальный уровень достигнут!
          </div>
        )}
      </div>
    </div>
  );
};
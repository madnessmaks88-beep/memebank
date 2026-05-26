import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useVKAuth } from './useVKAuth';

export interface Transaction {
  id: string;
  amount: number;
  type: string;
  created_at: string;
}

export const useWallet = () => {
  const { user } = useVKAuth();
  const [balance, setBalance] = useState<number>(0);
  const [history, setHistory] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dailyClaimReady, setDailyClaimReady] = useState(false);

  // Функция загрузки данных кошелька
  const fetchWallet = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      //  Запускаем запросы параллельно. 
      // Promise.allSettled гарантирует, что ошибка одного не сломает другой.
      const [walletRes, historyRes] = await Promise.allSettled([
        supabase
          .from('wallets')
          .select('balance, last_daily_claim')
          .eq('user_id', user.id)
          .single(),
        
        supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10)
      ]);

      // 📦 Обработка баланса
      if (walletRes.status === 'fulfilled' && walletRes.value.data) {
        const wallet = walletRes.value.data;
        setBalance(wallet.balance ?? 0);

        // Проверка: получен ли бонус сегодня?
        const todayStart = new Date().setHours(0, 0, 0, 0);
        const lastClaim = wallet.last_daily_claim
          ? new Date(wallet.last_daily_claim).setHours(0, 0, 0, 0)
          : 0;
        setDailyClaimReady(lastClaim < todayStart);
      } else {
        // Фолбэк при ошибке сети
        console.warn('Wallet fetch failed:', walletRes.status === 'rejected' ? walletRes.reason : 'No data');
        setBalance(0);
      }

      // 📜 Обработка истории
      if (historyRes.status === 'fulfilled' && historyRes.value.data) {
        setHistory(historyRes.value.data);
      } else {
        console.warn('History fetch failed:', historyRes.status === 'rejected' ? historyRes.reason : 'No data');
        setHistory([]);
      }

    } catch (err: any) {
      console.error('useWallet critical error:', err);
      setError('Не удалось загрузить данные кошелька');
      setBalance(0);
      setHistory([]);
    } finally {
      // ✅ ГАРАНТИРОВАННО выключаем спиннер, даже при ошибке или отмене запроса
      setLoading(false);
    }
  }, [user]);

  // Загружаем данные при монтировании или смене пользователя
  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  // Функция получения ежедневного бонуса
  const claimBonus = useCallback(async () => {
    if (!user) return false;
    
    try {
      const { error } = await supabase.rpc('claim_daily_bonus', { target_user_id: user.id });
      if (error) throw error;
      
      // После успеха обновляем данные
      await fetchWallet();
      return true;
    } catch (err: any) {
      console.error('Claim bonus error:', err);
      alert(err.message || 'Не удалось получить бонус. Попробуйте позже.');
      return false;
    }
  }, [user, fetchWallet]);

  return {
    balance,
    history,
    loading,
    error,
    dailyClaimReady,
    claimBonus,
    refresh: fetchWallet
  };
};
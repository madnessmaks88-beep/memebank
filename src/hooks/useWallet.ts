import { useState, useEffect } from 'react';
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
  const [dailyClaimReady, setDailyClaimReady] = useState(false);

  useEffect(() => {
    if (user) {
      fetchWallet();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchWallet = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // 1. Баланс
      const { data: walletData } = await supabase
        .from('wallets')
        .select('balance, last_daily_claim')
        .eq('user_id', user.id)
        .single();

      if (walletData) {
        setBalance(walletData.balance);
        // Проверка: был ли бонус сегодня?
        const today = new Date().setHours(0,0,0,0);
        const lastClaim = new Date(walletData.last_daily_claim).setHours(0,0,0,0);
        setDailyClaimReady(lastClaim < today);
      }

      // 2. История (последние 10)
      const { data: historyData } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (historyData) setHistory(historyData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Метод для получения бонуса
  const claimBonus = async () => {
    if (!user) return;
    try {
      const { error } = await supabase.rpc('claim_daily_bonus', { target_user_id: user.id });
      if (error) throw error;
      
      // Обновляем данные
      await fetchWallet();
      return true;
    } catch (e: any) {
      console.error(e);
      alert(e.message || 'Ошибка получения бонуса');
      return false;
    }
  };

  return { balance, history, loading, dailyClaimReady, claimBonus, refresh: fetchWallet };
};
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
  const { user, loading: authLoading } = useVKAuth();
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [dailyClaimReady, setDailyClaimReady] = useState(false);

  const fetchWallet = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    
    setLoading(true);
    try {
      const [wRes, hRes] = await Promise.allSettled([
        supabase.from('wallets').select('balance, last_daily_claim').eq('user_id', user.id).single(),
        supabase.from('transactions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10)
      ]);

      if (wRes.status === 'fulfilled' && wRes.value.data) {
        setBalance(wRes.value.data.balance || 0);
        const today = new Date().setHours(0,0,0,0);
        const last = wRes.value.data.last_daily_claim ? new Date(wRes.value.data.last_daily_claim).setHours(0,0,0,0) : 0;
        setDailyClaimReady(last < today);
      }

      if (hRes.status === 'fulfilled' && hRes.value.data) {
        setHistory(hRes.value.data);
      }
    } catch (e) {
      console.error('[Wallet] Fetch error:', e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchWallet(); }, [fetchWallet]);

  const claimBonus = async () => {
    if (!user) return false;
    try {
      const { error } = await supabase.rpc('claim_daily_bonus', { target_user_id: user.id });
      if (error) throw error;
      await fetchWallet();
      return true;
    } catch (e: any) {
      alert(e.message || 'Ошибка бонуса');
      return false;
    }
  };

  return { balance, history, loading: loading || authLoading, dailyClaimReady, claimBonus, refresh: fetchWallet };
};
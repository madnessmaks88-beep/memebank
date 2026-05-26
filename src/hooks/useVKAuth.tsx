import { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';

export interface VKUser {
  id: number;
  first_name: string;
  last_name: string;
  photo_100: string;
  photo_200: string;
}

export const useVKAuth = () => {
  const [user, setUser] = useState<VKUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        // 1. Инициализируем VK Bridge
        await bridge.send('VKWebAppInit');
        
        // 2. Получаем данные пользователя
        const info = await bridge.send('VKWebAppGetUserInfo');
        
        if (mounted) {
          setUser({
            id: info.id,
            first_name: info.first_name || 'User',
            last_name: info.last_name || '',
            photo_100: info.photo_100 || '',
            photo_200: info.photo_200 || '',
          });
        }
      } catch (e) {
        console.warn('[VKAuth] Bridge init failed, using fallback:', e);
        if (mounted) {
          // Фолбэк для отладки вне ВК или при сбое
          setUser({
            id: 1,
            first_name: 'Тест',
            last_name: 'Юзер',
            photo_100: 'https://placehold.co/100/00E5FF/000?text=T',
            photo_200: 'https://placehold.co/200/00E5FF/000?text=T',
          });
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();
    return () => { mounted = false; };
  }, []);

  return { user, loading };
};
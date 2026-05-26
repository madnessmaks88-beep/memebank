import { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge'; // ✅ Официальный импорт

interface VKUser {
  id: number;
  first_name: string;
  last_name: string;
  photo_100: string;
  photo_200: string;
}

export const useVKAuth = () => {
  const [user, setUser] = useState<VKUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        console.log('[VKAuth] Инициализация bridge...');
        await bridge.send('VKWebAppInit');
        console.log('[VKAuth] Bridge готов.');

        const userInfo = await bridge.send('VKWebAppGetUserInfo');
        console.log('[VKAuth] Данные пользователя:', userInfo);

        if (isMounted) {
          setUser({
            id: userInfo.id,
            first_name: userInfo.first_name || 'User',
            last_name: userInfo.last_name || '',
            photo_100: userInfo.photo_100 || '',
            photo_200: userInfo.photo_200 || '',
          });
        }
      } catch (err: any) {
        console.error('[VKAuth] Ошибка инициализации:', err);
        if (isMounted) {
          setError(err.message);
          // 🛡 Фолбэк для тестирования вне ВК или при сбое bridge
          setUser({
            id: 1,
            first_name: 'Тест',
            last_name: 'Юзер',
            photo_100: 'https://placehold.co/100/00E5FF/000?text=T',
            photo_200: 'https://placehold.co/200/00E5FF/000?text=T',
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initAuth();
    return () => { isMounted = false; };
  }, []);

  return { user, loading, error };
};
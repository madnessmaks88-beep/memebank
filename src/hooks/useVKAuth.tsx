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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initApp = async () => {
      try {
        console.log('[VKAuth] Начинаем инициализацию...');
        await bridge.send('VKWebAppInit');
        console.log('[VKAuth] Мост инициализирован!');

        const userInfo = await bridge.send('VKWebAppGetUserInfo');
        
        if (isMounted) {
          setUser({
            id: userInfo.id,
            first_name: userInfo.first_name || 'User',
            last_name: userInfo.last_name || '',
            photo_100: userInfo.photo_100 || '',
            photo_200: userInfo.photo_200 || '',
          });
          setError(null);
        }
      } catch (err) {
        console.error('[VKAuth] Ошибка инициализации:', err);
        if (isMounted) {
          setError('Приложение не инициализировано. Откройте ссылку внутри ВКонтакте.');
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

    initApp();
    return () => { isMounted = false; };
  }, []);

  const retryInit = () => {
    setLoading(true);
    setError(null);
    window.location.reload(); 
  };

  return { user, loading, error, retryInit };
};
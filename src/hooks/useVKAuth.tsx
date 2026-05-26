import { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';

export interface VKUser {
  id: number;
  first_name: string;
  last_name: string;
  photo_100?: string;
  photo_200?: string;
}

export const useVKAuth = () => {
  const [user, setUser] = useState<VKUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Инициализация VK Bridge
    bridge.send('VKWebAppInit');

    // Получаем данные пользователя
    bridge.send('VKWebAppGetUserInfo')
      .then((data) => {
        setUser({
          id: data.id,
          first_name: data.first_name,
          last_name: data.last_name,
          photo_100: data.photo_100 || data.photo_200,
        });
      })
      .catch((err) => {
        console.warn('Не удалось получить данные пользователя:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { user, loading };
};

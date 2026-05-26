import bridge from '@vkontakte/vk-bridge';
import { useEffect } from 'react';

export const useVKBridge = () => {
  useEffect(() => {
    bridge.send('VKWebAppInit').catch(() => console.warn('VK Bridge не инициализирован'));
  }, []);

  const copyToClipboard = (text: string) => bridge.send('VKWebAppCopyText', { text });
  
  // ✅ Фикс TS-ошибки: метод есть в API, но не типизирован в пакете
  const openLink = (url: string) => bridge.send('VKWebAppOpenLink' as any, { link: url });

  return { copyToClipboard, openLink };
};
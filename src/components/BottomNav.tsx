import React from 'react';
import { Tabbar, TabbarItem } from '@vkontakte/vkui';
import { Icon28HomeOutline, Icon28AddCircleOutline, Icon28UserOutline, Icon28WalletOutline } from '@vkontakte/icons';
import { TabId } from '../types';

interface Props {
  active: TabId;
  onChange: (tab: TabId) => void;
}

export const BottomNav: React.FC<Props> = ({ active, onChange }) => (
  <Tabbar>
    <TabbarItem selected={active === 'feed'} onClick={() => onChange('feed')}>
      <Icon28HomeOutline />
      Лента
    </TabbarItem>
    <TabbarItem selected={active === 'upload'} onClick={() => onChange('upload')}>
      <Icon28AddCircleOutline />
      Загрузить
    </TabbarItem>
    <TabbarItem selected={active === 'wallet'} onClick={() => onChange('wallet')}>
      <Icon28WalletOutline />
      Кошелек
    </TabbarItem>
    <TabbarItem selected={active === 'profile'} onClick={() => onChange('profile')}>
      <Icon28UserOutline />
      Профиль
    </TabbarItem>
  </Tabbar>
);
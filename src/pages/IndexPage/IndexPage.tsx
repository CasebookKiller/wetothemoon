
import * as RU from '@/locale/ru.json';

import * as packageJson from '@/../package.json';

const version = packageJson.version;

import React, { useEffect, useState, type FC } from 'react';

import { retrieveLaunchParams } from '@tma.js/sdk-react';

import { addLocale, locale as Locale } from 'primereact/api';
//import { Panel } from 'primereact/panel';
import { Chip } from 'primereact/chip';

//import { Link } from '@/components/Link/Link.tsx';
import { Page } from '@/components/Page.tsx';
import { Profile } from '@/components/Profile/Profile';
import { TopMenu } from '@/components/TopMenu/TopMenu';

import { useAuth } from '@/hooks/useAuth';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useUser } from '@/hooks/useUser';

import { User } from '@/context/UserContext';

import './IndexPage.css';
import { TemplatePanels } from '@/components/TemplatePanels/TemplatePanels';

const lng = 'ru';

addLocale(lng, RU.ru);
Locale(lng);

export const IndexPage: FC = () => {
  const LP = retrieveLaunchParams(); console.log('LaunchParams: ', LP);
  
  const tgWebAppData = LP?.tgWebAppData;
  const ID = tgWebAppData;
  const SP = ID?.start_param; console.log('start_param: ', SP);
  
  const username = ID?.user?.username;
  const firstName = ID?.user?.first_name;
  const lastName = ID?.user?.last_name;

  const tgid = ID?.user?.id.toString();

  const name = lastName && firstName && `${firstName} ${lastName}` || username || '';

  const [userId] = useState<string>(tgid || '');

  const { addUser } = useUser();
  const { user, setUser } = useAuth();
  const { getItem } = useLocalStorage();

  useEffect(() => {
    if (!user) {
      const defaultUser: User = { id: 0, name: '', email: '', password: '', token: '', avatar: '', tgid: tgid }
      const storedUser = JSON.parse(getItem('user')||'{}');
      if (storedUser?.name) { setUser(storedUser) } else { setUser(defaultUser) }
    }
  });



  useEffect(() => {
    user && addUser(user);
  }, [user]);

  return (
    <React.Fragment>
      <Page back={false}>
        <TopMenu />
        <div className='app p-0'/>
        <Profile
          name={name}
          username={username}
          userId={userId}
          bio={user?.bio||''}//{'Судебный юрист с 25.09.2000. Сопровождение споров из неисполнения договорных обязательств, дел о банкротстве, об оспаривании действий органов государственной власти и многих других.'}
        />

        <TemplatePanels/>

        <div
          className='my-5 mx-2 app theme-hint-color theme-bg-secondary text-xs'
        >
          <div className='block text-center mb-2'>
            <Chip className='text-2xs shadow-3' label={'UId: ' + userId}/>
          </div>
          <div className='block text-center mb-2'>
            <span>{'Платформа: ' + LP.tgWebAppPlatform}</span>
          </div>
          <div className='block text-center mb-1'>
            <span>Мини-приложение Telegram</span>
          </div>
          <div className='block text-center mb-1'>
            <span>Версия {version}</span>
          </div>
          <div className='block text-center mb-3'>
            <span>@2024-2025</span>
          </div>
        </div>      
      </Page>
    </React.Fragment>
  );
};

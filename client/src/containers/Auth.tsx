'use client';

import { useContext } from 'react';
import { Button } from '../components/Button.tsx';
import appContext from '../platform-agnostic/data-context/appContext';
import i18n from '../platform-agnostic/i18n/index';

/**
 * Get auth status
 */

export function AuthStatus() {
  const { appState } = useContext(appContext);

  return <>
    <p className='m_m_b'>
      <Button
        text='Submit'
        className='bg_primary'
      />
    </p>
    <p>
      <strong>
        {i18n.t('app.your_login_token_is')}
      </strong>
    </p>
    <p>
      {appState.auth.token}
    </p>
  </>;
}

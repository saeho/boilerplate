import type { AppProps } from 'next/app'
import { AuthStatus } from '../containers/Auth.tsx';

/**
 * Index page
 */

function Page(p: AppProps) {

  return (
    <main className='p_l'>
      <AuthStatus />
    </main>
  );
}

export default Page;

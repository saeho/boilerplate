import { AuthStatus } from '../containers/Auth';
import type { AppProps } from 'next/app'

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

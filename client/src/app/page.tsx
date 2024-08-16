import type { AppProps } from 'next/app'
import { AuthStatus } from '../containers/Auth.tsx';
import { GenerateReport } from '../containers/Report.tsx';
import { Products } from '../containers/Products.tsx';

/**
 * Index page
 */

function Page(p: AppProps) {

  return (
    <main className='p_l'>
      <GenerateReport />
      <AuthStatus />
      <Products />
    </main>
  );
}

export default Page;

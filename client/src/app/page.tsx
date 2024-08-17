import type { AppProps } from 'next/app'
import ClinicalTrials from '../containers/ClinicalTrials.tsx';

/**
 * Index page
 */

function Page(p: AppProps) {

  return (
    <main className='p_l'>
      <ClinicalTrials />
    </main>
  );
}

export default Page;

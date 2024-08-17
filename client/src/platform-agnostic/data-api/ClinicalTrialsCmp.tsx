import { useQuery } from './apiClient';

/**
 * Compose; Clinical Trials API
 */

export function composeClinicalTrials(Cmp: React.FC<any>) {
  return function ClinicalTrialsCmp(p: any) {

    const { searchQuery } = p;
    const [{ data, loading }] = useQuery('clinical_trials', {
      limit: 100,
      searchQuery
    });

    return <Cmp
      {...p}
      // clin
      clinicalTrials={data}
      loading={loading}
      notReady
    />;
  }
}

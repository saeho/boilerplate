'use client';

import { useQuery } from './apiClient';

/**
 * Generate a report
 */

export function composeProducts(Cmp: React.FC<any>) {
  return function Products(p: any) {

    const { onCompleted } = p;
    const [{ data, loading }] = useQuery('products', {
      onCompleted
    });

    return <Cmp
      {...p}
      products={data}
      loading={loading}
    />;
  }
}

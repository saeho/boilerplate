'use client';

import { useMutation } from './apiClient';

/**
 * Generate a report
 */

export function composeGenerateReport(Cmp: React.FC<any>) {
  return function GenerateReport(p: any) {

    const { onCompleted } = p;
    const [generateReport, { mutating }] = useMutation('product_reports', {
      onCompleted
    });

    return <Cmp
      {...p}
      generateReport={generateReport}
      mutating={mutating}
    />;
  }
}

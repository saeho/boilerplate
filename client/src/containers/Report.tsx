'use client';

import { memo, useState } from 'react';
import { composeGenerateReport } from '../platform-agnostic/data-api/ReportCmp.tsx';
import { Button } from '../components/Button.tsx';
import i18n from '../platform-agnostic/i18n/index.ts';

/**
 * Generate report
 */

const GenerateReportCmp = composeGenerateReport((p: any) => {
  const { mutating, generateReport, createdId } = p;

  return <div className='m_m_b'>
    <Button
      loading={mutating}
      loadingText={i18n.t('form.creating_')}
      className='bg_primary m_m_b'
      text={i18n.t('app.generate_report')}
      onClick={() => generateReport()}
    />
    {!createdId ? null
    : <>
      <p>
        <strong>{i18n.t('app.created_report')}:</strong>
      </p>
      <p>
        {i18n.t('app.document_id')}: {createdId}
        <br />
        <a href={`https://docs.google.com/document/d/${createdId}`} target='_blank'>
          {i18n.t('app.click_open_report')}
        </a>
      </p>
    </>}
  </div>;
});

export const GenerateReport = memo(() => {
  const [createdId, setCreatedId] = useState<string | null>(null);

  return (
    <GenerateReportCmp
    createdId={createdId}
      onCompleted={(id: string) => {
        console.log('createdId1:', id);
        setCreatedId(id);
      }}
    />
  );
});

GenerateReport.displayName = 'GenerateReport';

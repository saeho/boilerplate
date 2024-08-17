'use client';

import { Fragment, memo, useState } from 'react';
import{ SearchBar } from '../components/Form.tsx';
import { Table, TableRow } from '../components/Table.tsx';
import { composeClinicalTrials } from '../platform-agnostic/data-api/ClinicalTrialsCmp.tsx';
import { cn } from '../platform-agnostic/utils/string.ts';
import i18n from '../platform-agnostic/i18n/index.ts';

/**
 * Types
 */

type StudyStatus = 'RECRUITING' | 'NOT_YET_RECRUITING' | 'COMPLETED' | 'ACTIVE_NOT_RECRUITING' | 'ENROLLING_BY_INVITATION' | 'WITHHELD' | 'TEMPORARILY_NOT_AVAILABLE' | 'WITHDRAWN' | 'TERMINATED' | 'SUSPENDED' | 'AVAILABLE' | 'APPROVED_FOR_MARKETING' | 'NO_LONGER_AVAILABLE';
type StudyPhase = null | 'NA' | 'EARLY_PHASE1' | 'PHASE1' | 'PHASE2' | 'PHASE3' | 'PHASE4';

type NSCLCIntervention = {
  type: string;
  name: string;
  description: string;
  armGroupLabels: string[];
};

type NSCLCStudyData = {
  id: number;
  nctId: string;
  briefTitle: string;
  officialTitle: string;
  briefSummary: string | null;
  detailedDescription: string | null;
  overallStatus: StudyStatus;
  phase: StudyPhase;
  studyType: string | null;
  conditions: string[];
  interventions: NSCLCIntervention[];
  verifiedDate: Date | null;
  firstSubmitDate: Date | null;
  lastSubmitDate: Date | null;
};

type ClinicalTrialsData = {
  total: number;
  hasMore: boolean;
  data: NSCLCStudyData[];
};

type ClinicalTrialsProps = {
  searchQuery: string;
  loading: boolean;
  clinicalTrials?: ClinicalTrialsData;
};

/**
 * Constants
 */

const TABLE_HEADERS = [{
  text: i18n.t('form.study')
  // className: 'something',
  // iconName: 'something',
  // sort: 'ASC' | 'DESC' | 'NONE' | null
  // etc...
}, {
  text: i18n.t('form.status')
}, {
  text: i18n.t('form.phase')
}, {
  text: i18n.t('form.conditions')
}, {
  text: i18n.t('form.interventions')
}];

/**
 * Clinical trial item
 */

const ClinicalTrialItem = memo((p: NSCLCStudyData) => {
  const { nctId, briefTitle, overallStatus, phase, conditions, interventions } = p;
  return <TableRow
    cols={[{
      text: <>
        <p>
          <strong>
            {briefTitle}
          </strong>
        </p>
        <p>
          {nctId}
        </p>
      </>,
    }, {
      text: i18n.t(overallStatus ? 'app.study_status_' + overallStatus : 'form.n_a'),
    }, {
      text: i18n.t('app.study_phase_' + (phase || 'NONE')),
    }, {
      text: <p>
        {conditions.map((text, i) => (
          <Fragment key={i}>
            {i ? <br /> : null}
            {text}
          </Fragment>
        ))}
      </p>
    }, {
      text: <p>
        {interventions.map((iv, i) => (
          <Fragment key={i}>
            {i ? <br /> : null}
            {iv.name}
          </Fragment>
        ))}
      </p>
    }]}
  />;
});

ClinicalTrialItem.displayName = 'ClinicalTrialItem';

/**
 * Clinical trials; data table
 */

const ClinicalTrialsTable = memo((p: ClinicalTrialsProps) => {
  const { clinicalTrials, loading, searchQuery } = p;
  const notReady = !clinicalTrials;

  if (notReady) {
    return <p>{i18n.t('form.loading_')}</p>;
  }

  return <>
    <p className='m_d_t'>
      <strong>
        {i18n.t('form.instructions') + ': '}
      </strong>
      {i18n.t('app.search_instr')}
    </p>
    <p>
      <strong>
        {i18n.t('app.current_search') + ': '}
      </strong>
      {searchQuery}
    </p>
    <p>
      <strong>
        {i18n.t('form.total_found') + ': '}
      </strong>
      {clinicalTrials.total}
    </p>

    <Table
      headers={TABLE_HEADERS}
      className={cn('m_l_t', loading ? 'op_50' : '')}
    >
      {clinicalTrials.data?.map((item: any) => (
        <ClinicalTrialItem
          key={item.id}
          {...item}
        />
      ))}
    </Table>
  </>;
});

ClinicalTrialsTable.displayName = 'ClinicalTrialsTable';

const ClinicalTrialsTableWithData = composeClinicalTrials(ClinicalTrialsTable);

/**
 * Clinical trials; search & list data
 */

const ClinicalTrials = memo((p: ClinicalTrialsProps) => {

  const [searchQuery, setSearchQuery] = useState('');

  const onSearch = (searchInput: string) => {
    console.log('SAERCH:', searchInput);

    setSearchQuery(searchInput);
  };

  return <>
    <SearchBar
      onSearch={onSearch}
    />
    <ClinicalTrialsTableWithData
      searchQuery={searchQuery}
    />
  </>;
});

ClinicalTrials.displayName = 'ClinicalTrials';

export default ClinicalTrials;

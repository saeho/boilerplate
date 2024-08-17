import { makeRegexSafe } from '../utils/string.ts';

/**
 * Data Types
 */

// NOTE: When I searched through the dataset, this is all the phases/statuses I found.

type StudyStatus = 'RECRUITING' | 'NOT_YET_RECRUITING' | 'COMPLETED' | 'ACTIVE_NOT_RECRUITING' | 'ENROLLING_BY_INVITATION' | 'WITHHELD' | 'TEMPORARILY_NOT_AVAILABLE' | 'WITHDRAWN' | 'TERMINATED' | 'SUSPENDED' | 'AVAILABLE' | 'APPROVED_FOR_MARKETING' | 'NO_LONGER_AVAILABLE';
type StudyPhase = null | 'NA' | 'EARLY_PHASE1' | 'PHASE1' | 'PHASE2' | 'PHASE3' | 'PHASE4';

// If this was a real database,
// this type (NSLCStudyData) would be the output of a JOIN query.
// For a database, I would create several databases for trials, studies, organization, etc.

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

/**
 * Method args
 */

type ListArgs = {
  limit: number;
  searchQuery?: string;
};

type ListResult = {
  total: number;
  hasMore: boolean;
  data: NSCLCStudyData[];
};

/**
 * Memory database
 */

class MemoryDB {
  public name: string;
  private data: any[] = [];

  /**
   * Constructor
   */

  constructor(name: string) {
    this.name = name;
  }

  /**
   * Map data from 3rd party data source
   */

  public mapData(data: any, i: number): NSCLCStudyData {
    const { protocolSection } = data;
    return {
      id: i + 1,
      nctId: protocolSection.identificationModule.nctId,
      briefTitle: protocolSection.identificationModule.briefTitle,
      officialTitle: protocolSection.identificationModule.officialTitle,
      briefSummary: protocolSection.descriptionModule?.briefSummary || null,
      detailedDescription: protocolSection.descriptionModule?.detailedDescription || null,
      overallStatus: protocolSection.statusModule.overallStatus,
      phase: protocolSection.designModule?.phases?.[0] || null,
      studyType: protocolSection.designModule?.studyType || null,
      conditions: protocolSection.conditionsModule?.conditions || [],
      interventions: protocolSection.armsInterventionsModule?.interventions || [],
      verifiedDate: protocolSection.statusModule.statusVerifiedDate ? new Date(protocolSection.statusModule.statusVerifiedDate) : null,
      firstSubmitDate: protocolSection.statusModule.studyFirstSubmitDate ? new Date(protocolSection.statusModule.studyFirstSubmitDate) : null,
      lastSubmitDate: protocolSection.statusModule.lastUpdateSubmitDate ? new Date(protocolSection.statusModule.lastUpdateSubmitDate) : null,
    };
  }

  /**
   * Load data from JSON file
   */

  public async loadData(filePath: string) {
    const fileData = await Deno.readTextFile(filePath);

    try {
      const jsonData = JSON.parse(fileData);
      this.data = jsonData.map(this.mapData);

      // console.log(this.data.find(d => d.interventions.length > 0));
      // console.log(uniq(this.data.map(d => d.overallStatus)));

      // console.log(jsonData[0].id);
      // console.log(jsonData[1].id);
      // Object.keys(jsonData[0]).forEach(k => {
      //   console.log('======', k);
      //   console.log(jsonData[0][k]);
      // });

    } catch (err) {
      console.error(err);
      console.error('Warning: JSON.parse error in loadData()');
    }
  }

  public findAll(params: ListArgs): ListResult {
    const { limit, searchQuery } = params;

    let data;
    if (searchQuery?.trim()) {
      const regex = new RegExp(
        makeRegexSafe(searchQuery),
        'i'
      );

      data = this.data.filter(d => {
        const texts = (
          d.briefTitle + ' ' +
          d.officialTitle + ' ' +
          d.briefSummary + ' ' +
          d.detailedDescription
        );
        return regex.test(texts);
      });

    } else {
      data = this.data;
    }

    const total = data.length;

    return {
      total,
      hasMore: total > limit,
      data: data.slice(0, limit || 10)
    };
  }
}

const ClinicalTrialsDB = new MemoryDB('clinical_trials');

ClinicalTrialsDB.loadData('ctg-studies.json');

export default ClinicalTrialsDB;

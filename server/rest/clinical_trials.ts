import ClinicalTrialsDB from '../data/memory.ts';

/**
 * Types
 */

type ListClinicalTrialsArgs = {
  searchQuery: string;
  limit: number;
};

/**
 * GET Method: List clinical trials
 */

export function listClinicalTrials(args: ListClinicalTrialsArgs) {
  const { searchQuery, limit } = args;

  return ClinicalTrialsDB.findAll({
    limit,
    searchQuery
  });
}

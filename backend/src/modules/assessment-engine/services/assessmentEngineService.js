const assessmentEngineRepository = require('../repositories/assessmentEngineRepository');

async function getAssessorPortalData() {
  return assessmentEngineRepository.getAssessorPortalData();
}

module.exports = {
  getAssessorPortalData
};

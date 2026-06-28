const learnerManagementRepository = require('../repositories/learnerManagementRepository');

async function listLearners() {
  return learnerManagementRepository.listLearners();
}

async function getLearnerPortalData() {
  return learnerManagementRepository.getLearnerPortalData();
}

module.exports = {
  listLearners,
  getLearnerPortalData
};

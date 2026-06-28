const workplaceLearningRepository = require('../repositories/workplaceLearningRepository');

async function getEmployerPortalData() {
  return workplaceLearningRepository.getEmployerPortalData();
}

module.exports = {
  getEmployerPortalData
};

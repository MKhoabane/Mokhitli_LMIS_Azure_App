const lmsRepository = require('../repositories/lmsRepository');

async function getFacilitatorPortalData() {
  return lmsRepository.getFacilitatorPortalData();
}

module.exports = {
  getFacilitatorPortalData
};

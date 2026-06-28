const auditRepository = require('../repositories/auditRepository');

async function getModeratorPortalData() {
  return auditRepository.getModeratorPortalData();
}

module.exports = {
  getModeratorPortalData
};

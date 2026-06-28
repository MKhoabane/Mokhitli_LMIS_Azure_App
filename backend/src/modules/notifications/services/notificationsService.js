const notificationsRepository = require('../repositories/notificationsRepository');

async function getParentPortalData() {
  return notificationsRepository.getParentPortalData();
}

module.exports = {
  getParentPortalData
};

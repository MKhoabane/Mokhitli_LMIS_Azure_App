const service = require('../services/notificationsService');

async function getParentPortal(req, res) {
  res.json(await service.getParentPortalData());
}

module.exports = {
  getParentPortal
};

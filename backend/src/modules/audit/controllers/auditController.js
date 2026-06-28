const service = require('../services/auditService');

async function getModeratorPortal(req, res) {
  res.json(await service.getModeratorPortalData());
}

module.exports = {
  getModeratorPortal
};

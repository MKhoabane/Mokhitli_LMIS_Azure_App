const service = require('../services/workplaceLearningService');

async function getEmployerPortal(req, res) {
  res.json(await service.getEmployerPortalData());
}

module.exports = {
  getEmployerPortal
};

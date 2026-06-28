const service = require('../services/learnerManagementService');

async function listLearners(req, res) {
  res.json(await service.listLearners());
}

async function getLearnerPortal(req, res) {
  res.json(await service.getLearnerPortalData());
}

module.exports = {
  listLearners,
  getLearnerPortal
};

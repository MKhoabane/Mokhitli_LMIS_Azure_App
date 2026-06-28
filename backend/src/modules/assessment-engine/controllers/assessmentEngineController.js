const service = require('../services/assessmentEngineService');

async function getAssessorPortal(req, res) {
  res.json(await service.getAssessorPortalData());
}

module.exports = {
  getAssessorPortal
};

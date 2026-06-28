const service = require('../services/lmsService');

async function getFacilitatorPortal(req, res) {
  res.json(await service.getFacilitatorPortalData());
}

module.exports = {
  getFacilitatorPortal
};

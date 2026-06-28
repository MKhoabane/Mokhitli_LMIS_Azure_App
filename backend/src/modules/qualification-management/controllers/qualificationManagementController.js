const service = require('../services/qualificationManagementService');

async function getData(req, res) {
  res.json(await service.getData());
}

module.exports = {
  getData
};

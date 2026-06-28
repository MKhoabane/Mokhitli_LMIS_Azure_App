const service = require('../services/userManagementService');

async function getData(req, res) {
  res.json(await service.getData());
}

module.exports = {
  getData
};

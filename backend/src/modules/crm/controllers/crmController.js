const service = require('../services/crmService');

async function getData(req, res) {
  res.json(await service.getData());
}

module.exports = {
  getData
};

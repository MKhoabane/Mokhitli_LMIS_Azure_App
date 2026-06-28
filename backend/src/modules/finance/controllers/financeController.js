const service = require('../services/financeService');

async function getData(req, res) {
  res.json(await service.getData());
}

module.exports = {
  getData
};

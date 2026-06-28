const service = require('../services/rbacService');

async function getData(req, res) {
  res.json(await service.getData());
}

module.exports = {
  getData
};

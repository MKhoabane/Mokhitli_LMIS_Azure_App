const service = require('../services/aiService');

async function getData(req, res) {
  res.json(await service.getData());
}

module.exports = {
  getData
};

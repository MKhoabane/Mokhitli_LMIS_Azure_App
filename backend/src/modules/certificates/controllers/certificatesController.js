const service = require('../services/certificatesService');

async function getData(req, res) {
  res.json(await service.getData());
}

module.exports = {
  getData
};

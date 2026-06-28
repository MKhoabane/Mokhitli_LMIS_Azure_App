const crmRepository = require('../repositories/crmRepository');

async function getData() {
  return crmRepository.getCrmPipeline();
}

module.exports = {
  getData
};

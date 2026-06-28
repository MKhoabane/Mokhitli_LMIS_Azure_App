const financeRepository = require('../repositories/financeRepository');

async function getData() {
  return financeRepository.getFinanceOverview();
}

module.exports = {
  getData
};

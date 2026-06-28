const reportingRepository = require('../repositories/reportingRepository');

async function getData() {
  return reportingRepository.getReportingSummary();
}

module.exports = {
  getData
};

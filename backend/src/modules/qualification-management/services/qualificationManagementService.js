const qualificationManagementRepository = require('../repositories/qualificationManagementRepository');

async function getData() {
  return qualificationManagementRepository.listQualifications();
}

module.exports = {
  getData
};

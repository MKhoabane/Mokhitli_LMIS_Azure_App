const userManagementRepository = require('../repositories/userManagementRepository');

async function getData() {
  return userManagementRepository.listUsers();
}

module.exports = {
  getData
};

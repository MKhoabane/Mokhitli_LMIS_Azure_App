const rbacRepository = require('../repositories/rbacRepository');

async function getData() {
  return rbacRepository.listRoles();
}

module.exports = {
  getData
};

const certificatesRepository = require('../repositories/certificatesRepository');

async function getData() {
  return certificatesRepository.listIssuedCertificates();
}

module.exports = {
  getData
};

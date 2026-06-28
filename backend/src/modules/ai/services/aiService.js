const aiRepository = require('../repositories/aiRepository');

async function getData() {
  return aiRepository.getAiInsights();
}

module.exports = {
  getData
};

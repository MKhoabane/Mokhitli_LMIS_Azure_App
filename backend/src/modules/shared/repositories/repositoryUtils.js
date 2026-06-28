const pool = require('../../../config/db');
const enterpriseData = require('../enterpriseData');

async function withFallback(queryFactory, fallbackFactory) {
  try {
    return await queryFactory();
  } catch {
    return fallbackFactory();
  }
}

module.exports = {
  pool,
  enterpriseData,
  withFallback
};

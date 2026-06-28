const express = require('express');
const moduleConfigs = require('../../index');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    name: 'QCTO LMIS Enterprise API',
    version: '1.0.0',
    modules: moduleConfigs.map((config) => ({
      id: config.id,
      name: config.name,
      basePath: config.basePath
    }))
  });
});

router.get('/modules', (req, res) => {
  res.json(
    moduleConfigs.map((config) => ({
      id: config.id,
      name: config.name,
      basePath: config.basePath,
      aliases: config.aliases || []
    }))
  );
});

module.exports = router;

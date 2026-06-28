const express = require('express');

function createModuleRouter(config, options = {}) {
  const router = express.Router();
  const status = options.status || 'scaffolded';

  router.get('/', (req, res) => {
    res.json({
      module: config.id,
      name: config.name,
      status,
      basePath: config.basePath
    });
  });

  return router;
}

module.exports = {
  createModuleRouter
};

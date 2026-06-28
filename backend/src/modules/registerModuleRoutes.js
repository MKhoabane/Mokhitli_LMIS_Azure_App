const moduleConfigs = require('./index');

function resolveRouter(routeExport) {
  if (routeExport && typeof routeExport.use === 'function') {
    return routeExport;
  }

  if (routeExport && routeExport.router && typeof routeExport.router.use === 'function') {
    return routeExport.router;
  }

  throw new Error('Module route export must be an Express router.');
}

function registerModuleRoutes(app) {
  return moduleConfigs.map((config) => {
    const routeExport = require(`./${config.id}/routes`);
    const router = resolveRouter(routeExport);
    const mountPaths = [config.basePath, ...(config.aliases || [])];

    mountPaths.forEach((mountPath) => {
      app.use(mountPath, router);
    });

    return {
      id: config.id,
      name: config.name,
      basePath: config.basePath,
      aliases: config.aliases || []
    };
  });
}

module.exports = {
  registerModuleRoutes
};

module.exports = {
  getRepository() {
    throw new Error(
      'normalizedDomainRepository is deprecated. Use the module-specific repositories under backend/src/modules/*/repositories instead.'
    );
  }
};

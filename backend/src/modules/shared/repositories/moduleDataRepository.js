module.exports = {
  getPayload() {
    throw new Error(
      'moduleDataRepository is deprecated. Use the module-specific repositories under backend/src/modules/*/repositories instead.'
    );
  }
};

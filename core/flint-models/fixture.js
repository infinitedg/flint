Flint = this.Flint || {};

Flint.fixtures = [];

/**
 * Method to add fixtures to a given simulator.
 * Fixtures provide the initial entries in the database.
 * @param {String} fixture The fixture file to load
 * @param {String} simulatorId The associated simulator
 */
Flint.addFixture = function(fixture, simulatorId) {
  if (! _.has(fixture, "simulatorId") && simulatorId)
    _.extend(fixture, { "simulatorId": simulatorId });
  Flint.fixtures.push(fixture);
};
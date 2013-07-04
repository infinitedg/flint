/**
@class Flint
*/
Flint = this.Flint || {};

/**
Array of fixtures for a given simulator. Available only on the server
@property fixtures
@type Array
*/
Flint.fixtures = [];

/**
 * Method to add fixtures to a given simulator.
 * Fixtures provide the initial entries in the database.
 * @method addFixture
 * @param {String} fixture The fixture file to load
 * @param {String} simulatorId The associated simulator
 */
Flint.addFixture = function(fixture, simulatorId) {
  if (! _.has(fixture, "simulatorId") && simulatorId)
    _.extend(fixture, { "simulatorId": simulatorId });
  Flint.fixtures.push(fixture);
};
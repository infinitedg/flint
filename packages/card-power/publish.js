/**
 @class Meteor.subscriptions
*/
 
/**
List of systems available for the current simulator
@method cards.power.systems
@param {String} simulatorId The simulator ID associated with the requested systems
*/
Meteor.publish('cards.power.systems', function(simulatorId) {
  return Flint.collection('systems').find(
    { simulatorId: simulatorId }, 
    { fields: { name: 1, power: 1, minPower: 1, maxPower: 1 }});
});
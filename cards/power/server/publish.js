Meteor.publish('cards.power.systems', function(simulatorId) {
  return Systems.find(
    { simulatorId: simulatorId }, 
    { fields: { name: 1, power: 1, minPower: 1, maxPower: 1 }});
});
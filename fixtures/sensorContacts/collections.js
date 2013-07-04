/**
@class Flint.collections
*/

// @TODO: Drop `SensorContacts` from global namespace, start using Flint.collection('sensorContacts')

/**
Collection of sensor contacts. Authoritative source of sensor information to the simulator.
@property sensorContacts
@type Meteor.Collection
*/
SensorContacts = Flint.collection('sensorContacts');
/**
 * Model Declarations
 */
Systems = Flint.collection('systems');
SensorContacts = Flint.collection('sensorContacts');
Participants = Flint.collection('participants');

// @TODO Figure out where we ought to put these model declarations
// @TODO Figure out if we really want to litter the global namespace with collection names. Perhaps using Flint.collections['name'] is better?
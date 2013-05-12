/**
 * Core declaration of basic system collections
*/
Flint = this.Flint || {};

Flint.clients       = new Meteor.Collection("flint.clients");
Flint.stations      = new Meteor.Collection("flint.stations");
Flint.simulators    = new Meteor.Collection("flint.simulators");
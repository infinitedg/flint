/**
@class Flint
*/
Flint = this.Flint || {};

/**
Meteor collection of Clients. Defined internally as `flint.clients`
@property clients
@type Meteor.Collection
*/
Flint.clients       = new Meteor.Collection("flint.clients");

/**
Meteor collection of Stations. Defined internally as `flint.stations`
@property stations
@type Meteor.Collection
*/
Flint.stations      = new Meteor.Collection("flint.stations");

/**
Meteor collection of Clients. Defined internally as `flint.clients`
@property clients
@type Meteor.Collection
*/
Flint.simulators    = new Meteor.Collection("flint.simulators");
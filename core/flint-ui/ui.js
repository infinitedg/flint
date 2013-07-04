/**
@class Flint
*/
Flint = this.Flint || {};

/**
* Retrieve the current card's ID. Reactive.
* @method cardId
* @return {String} The ID of the currently selected card.
*/
Flint.cardId = Utils.memoize(function() {
  var result;
  
  if (Flint.station() && Flint.station().cards && Flint.station().cards.length > 0)
    result = Flint.station().cards[0].cardId;
  if (Flint.station() && Flint.station().cardId)
    result = Flint.station().cardId;
  if (Flint.client() && Flint.client().cardId)
    result = Flint.client().cardId;
  
  return result;
});

/**
* Retrieve the current layout. Reactive.
* @method layout
* @return {String} The ID of the currently applied layout. If no theme is available, defaults to "default".
*/
Flint.layout = Utils.memoize(function() {
  var result = "default";
  
  if (Flint.simulator() && Flint.simulator().layout)
    result = Flint.simulator().layout;
  if (Flint.station() && Flint.station().layout)
    result = Flint.station().layout;
  if (Flint.client() && Flint.client().layout)
    result = Flint.client().layout;
  if (Meteor.isClient && Session.get("layout"))
    result = Session.get("layout");

  return result;
});

/**
* Retrieve the current theme. Reactive.
* @method theme
* @return {String} The ID of the currently applied theme. If no theme is available, defaults to "default". 
*/

Flint.theme = Utils.memoize(function() {
  var result = "default";
  
  if (Flint.simulator() && Flint.simulator().theme)
    result = Flint.simulator().theme;
  if (Flint.station() && Flint.station().theme)
    result = Flint.station().theme;
  if (Flint.client() && Flint.client().theme)
    result = Flint.client().theme;

  return result;
});

/**
* Set the current card of the client
* @method setCardId
* @param {String} [id] When set, updates the current card by ID. If unset, removes the current card from the client object
*/
Flint.setCardId = function(id) {
  if (id !== undefined)
    Flint.clients.update(Flint.clientId(), { $set: { cardId: id }});
  else
    Flint.clients.update(Flint.clientId(), { $unset: { cardId: "" }});
};


/**
@class Handlebars.helpers
*/

/**
* Register the theme helper on Handlebars. Returns the current theme to Handlebars.
* @method theme
*/
Handlebars.registerHelper('theme', Flint.theme);

/**
* Register the theme helper on Handlebars. Returns the current layout to Handlebars.
* @method layout
*/
Handlebars.registerHelper('layout', Flint.layout);

/**
* Register the theme helper on Handlebars. Returns the current list of cards to Handlebars.
* @method cards
*/
Handlebars.registerHelper('cards', Utils.memoize(function() {
  if (Flint.station())
    return Flint.station().cards;
}));
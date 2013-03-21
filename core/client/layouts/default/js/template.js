(function() {
  Template.layout_default.simulator = function() {
    return Session.get('station');
  };
  
  Template.layout_default.station = function() {
    return Session.get('station');
  };
  
  Template.layout_default.hideCardlistCSS = function() {
    if (Session.equals('loggedIn', true)) {
      return '';
    } else {
      return 'hide';
    }
  };
  
  Template.layout_default.loggedIn = function() {
    return Session.equals('loggedIn', true);
  };
  
  Template.layout_default.cards = function() {
    return Session.get('station').cards;
  };
  
  var autorun;
  Template.layout_default.created = function() {
    autorun = Deps.autorun(function() {
      $('div.card').hide();
      $('div.card#card-' + Session.get('currentCard')).show();
    });
  };
  
  Template.layout_default.rendered = function() {
    Session.setDefault('currentCard', Template.layout_default.cards()[0].cardId);
    if (!$('div.card:visible')) {
      $('div.card:first').show();
      $('div.card').remove(':first').hide();
    } else {
      autorun.invalidate();
    }
  };
  
  Template.layout_default.destroyed = function() {
    autorun.stop();
  };
}());

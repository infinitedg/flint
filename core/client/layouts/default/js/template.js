(function() {
  Template.layout_default.simulator = function() {
    return Flint.getSimulator();
  };
  
  Template.layout_default.station = function() {
    return Flint.getStation();
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
    return Flint.getStation(false).cards;
  };
  
  var autorun;
  Template.layout_default.created = function() {
    autorun = Deps.autorun(function() {
      if ('card-' + Session.get('currentCard') !== $('div.card:visible').attr('id')) {
        $('div.card:visible').fadeOut(Flint.transitionSpeed, function(){
          $('div.card#card-' + Session.get('currentCard')).fadeIn(Flint.transitionSpeed);
        });
      } else {
        $('div.card').not('#card-' + Session.get('currentCard')).hide();
        $('div.card#card-' + Session.get('currentCard')).show();
      }
    });
    
    // For old times' sake :)
    Flint.play('sciences.wav');
  };
  
  Template.layout_default.rendered = function() {
    Session.setDefault('currentCard', Template.layout_default.cards()[0].cardId);
    if (!$('div.card:visible')) {
      $('div.card:first').show();
      $('div.card').not(':first').hide();
    } else {
      autorun.invalidate();
    }
  };
  
  Template.layout_default.destroyed = function() {
    autorun.stop();
  };
}());

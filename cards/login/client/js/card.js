(function (){
  Session.setDefault('loggedIn', false);
  
  Template.card_login.events = {
    'click .btn-login': function(e) {
      Flint.beep();
      Session.set('loggedIn', true);
      Session.set('currentUser', $('.loginname').val());
      // Stations.update({_id: Flint.getStation(false)._id}, {$set: {currentUser: $('.loginname').val()}});
      return false;
    },
    'click .btn-logout': function(e) {
      Flint.beep();
      Session.set('loggedIn', false);
      Session.set('currentUser', undefined);
      Stations.update({_id: Flint.getStation(false)._id}, {$unset: {currentUser: 1}});
      return false;
    },
    'keypress input.loginname': function(e) {
      if (e.which === 13) {
        Template.card_login.events['click .btn-login'](null);
        e.preventDefault();
        return false;
      }
      return true;
    }
  };
  
  Template.card_login.loggedIn = function() {
    return Session.equals('loggedIn', true);
  };
  
  Template.card_login.userName = function() {
    return Session.get('currentUser');
  };
}());
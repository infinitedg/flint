/**
@module Templates
@submodule Cards
*/
 
/**
Station card for logging the user in by name (No authentication)
@class card_login
*/

Template.card_login.events = {
  /**
  Log the user in with the name they provide. Beep too.
  @method click .btn-login
  */
  'click .btn-login': function(e) {
    Flint.beep();
    Flint.login($('.loginname').val());
    e.preventDefault();
    return false;
  },
  
  /**
  Beep and log the user out.
  @method click .btn-logout
  */
  'click .btn-logout': function(e) {
    Flint.beep();
    Flint.logout();
    e.preventDefault();
    return false;
  },
  
  /**
  Trigger a login if the user presses return/enter (key 13)
  @method keypress input.loginname
  */
  'keypress input.loginname': function(e, t) {
    if (e.which === 13) {
      // Simulate click event
      var evObj = document.createEvent('Events');
      evObj.initEvent('click', true, false);
      t.find('.btn-login').dispatchEvent(evObj);
      
      e.preventDefault();
      return false;
    }
    return true;
  }
};

Template.card_login.loginImage = function(){
  return Flint.a("/Login");
}
Template.card_login.client = function() {
  return Flint.client();
}
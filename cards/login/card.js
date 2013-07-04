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
    Flint.logIn($('.loginname').val());
    return false;
  },
  
  /**
  Beep and log the user out.
  @method click .btn-logout
  */
  'click .btn-logout': function(e) {
    Flint.beep();
    Flint.logOut();
    return false;
  },
  
  /**
  Trigger a login if the user presses return/enter (key 13)
  @method keypress input.loginname
  */
  'keypress input.loginname': function(e) {
    if (e.which === 13) {
      Template.card_login.events['click .btn-login'](null);
      e.preventDefault();
      return false;
    }
    return true;
  }
};
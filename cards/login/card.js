Template.card_login.events = {
  'click .btn-login': function(e) {
    Flint.beep();
    Flint.logIn($('.loginname').val());
    return false;
  },
  'click .btn-logout': function(e) {
    Flint.beep();
    Flint.logOut();
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
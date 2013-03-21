(function () {
  'use strict';
  
  Template.themePicker.theme = function() {
    return Session.get('theme');
  };
  
}());
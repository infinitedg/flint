(function (){
  'use strict';
  
  Template.programming_tools.programmingEnabled = function() {
    return Session.get('_programming');
  };
  
  Template.programming_tools.offline = function() {
    var r = Meteor.status();
    return !r.connected;
  };
  
  Template.programming_tools.offlineMessage = function() {
    var r = Meteor.status();
    return r.reason;
  };
  
  Template.programming_tools.offlineStatus = function() {
    var r = Meteor.status();
    return r.status;
  };
  
  Template.programming_tools.offlineCounting = function() {
    var r = Meteor.status();
    var s = 'Retried ' + r.retryCount + ' times - next attempt in ' + Math.round((r.retryTime - (new Date()).getTime()) / 1000) + ' seconds';
    return s;
  };
  
  Template.programming_tools.events = {
    'click a': function(e, t) {
      Meteor.reconnect();
      e.preventDefault();
    }
  };
  
}());
var Flint = Flint || {};

(function () {
  'use strict';
  
  var spokenPhrases = {};
  var voicePrefix = '/voices/';
  
  _.extend(Flint, {
    
    // Function to read text aloud
    // This will break someday when google shuts this down. If we can find a better component for this that would be ideal.
    say: function(txt) {
      if (spokenPhrases[txt] === undefined || new Date().getTime() - spokenPhrases[txt] >= 1000) {
        Flint.Log.verbose('Said "'+txt+'"', 'Speech');
        meSpeak.speak(txt);
        spokenPhrases[txt] = new Date().getTime();
      }
    },
    loadVoice: function(name) {
      meSpeak.loadVoice(voicePrefix + name + '.json');
    }
  });
  
  // Trigger when everything is loaded
  Meteor.startup(function(){
    meSpeak.loadConfig(voicePrefix + "mespeak_config.json");
    Flint.loadVoice('en-us');
    Flint.Log.verbose('MeSpeak loaded','Speech');
  });
}());
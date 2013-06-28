Flint = this.Flint || {};

/** @TODO Consider encapsulating mespeak in its own package and upload it to Atmosphere */

var spokenPhrases = {};
var voicePrefix = '/packages/voice/voices/';

_.extend(Flint, {
  // Function to read text aloud
  /**
   * Text-to-speak function. If a phrase is being triggered rapidly, it will rate limit it to once each second
   * @param {String} txt The text to speak
   */
  say: function(txt) {
    if (spokenPhrases[txt] === undefined || new Date().getTime() - spokenPhrases[txt] >= 1000) {
      Flint.Log.verbose('Said "'+txt+'"', 'Speech');
      meSpeak.speak(txt);
      spokenPhrases[txt] = new Date().getTime();
    }
  },

  /**
   * Wrapper function for meSpeak voice loader. Languages available include:
   *   * ca (Catalan)
   *   * cs (Czech)
   *   * de (German)
   *   * el (Greek)
   *   * en/en (English)
   *   * en/en-n (English, regional)
   *   * en/en-rp (English, regional)
   *   * en/en-sc (English, Scottish)
   *   * en/en-us (English, US)
   *   * en/en-wm (English, regional)
   *   * eo (Esperanto)
   *   * es (Spanish)
   *   * es-la (Spanish, Latin America)
   *   * fi (Finnish)
   *   * fr (French)
   *   * hu (Hungarian)
   *   * it (Italian)
   *   * kn (Kannada)
   *   * la (Latin)
   *   * lv (Latvian)
   *   * nl (Dutch)
   *   * pl (Polish)
   *   * pt (Portuguese, Brazil)
   *   * pt-pt (Portuguese, European)
   *   * ro (Romanian)
   *   * sk (Slovak)
   *   * sv (Swedish)
   *   * tr (Turkish)
   * @param {String} name The name of the voice to load
   */
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

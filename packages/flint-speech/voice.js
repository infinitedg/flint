/**
* @class Flint
*/

var spokenPhrases = {};
var defaultVoice = null;
var voices = [];
var voiceSettings = {
	pitch: 1,
	volume: 1,
	rate: 1,
	lang: 'en-US'
};

var checkCompatibility = function() {
	if (!window.speechSynthesis) {
		Flint.Log.warn("Speech synthesis not available in this browser.");
		return false;
	}
	return true;
};

_.extend(Flint, {
  /**
   * Text-to-speak function. If a phrase is being triggered rapidly, it will rate limit it to once each second
   * May be slow with first phrase, as it lazy-loads its speech configuration and voice
   * @method say
   * @param {String} txt The text to speak
   */
  say: function(txt) {
  	if (spokenPhrases[txt] === undefined && checkCompatibility()) {
      Flint.Log.verbose('Said "' + txt + '"', 'Speech');
      var msg = new SpeechSynthesisUtterance(txt);
      msg.onend = function() {
      	delete spokenPhrases[txt];
      };
      msg.voice = defaultVoice;
      msg.rate = voiceSettings.rate;
      msg.volume = voiceSettings.volume;
      msg.pitch = voiceSettings.pitch;
      msg.lang = voiceSettings.lang;

      spokenPhrases[txt] = (new Date()).getTime();
      speechSynthesis.speak(msg);
    }
  },

  /**
   * Sets the voice to an available system voice.
   * @return {Boolean} True if successful, false if not successful
   */
  setVoice: function(newVoice) {
  	if (checkCompatibility()) {
	  	var result = speechSynthesis.getVoices().filter(function(voice) { return voice.name == newVoice; })[0];
	  	if (result) {
	  		defaultVoice = result;
	  		return true;
	  	} else {
	  		return false;
	  	}
	}
  },

  getVoices: function() {
  	if (voices.length === 0 && window.speechSynthesis) {
  		speechSynthesis.getVoices().forEach(function(voice) {
		  voices.push(voice.name);
		});
	}
	return voices;
  },

  voiceProperty: function(property, newValue) {
  	if (checkCompatibility()) {
  		if (newValue) {
  			switch (property) {
  				case "rate":
	  				if (isNaN(newValue)) {
	  					Flint.Log.warn('Invalid rate setting (0.1 - 10)');
	  					return false;
		  			}
		  			newValue = (newValue < 0.1) ? 0.1 : newValue;
	  				newValue = (newValue > 10) ? 10 : newValue;
  				break;

  				case "volume":
	  				if (isNaN(newValue)) {
	  					Flint.Log.warn('Invalid volume setting (0 - 1)');
	  					return false;
		  			}
		  			newValue = (newValue < 0) ? 0 : newValue;
	  				newValue = (newValue > 1) ? 1 : newValue;
  				break;
  				case "pitch":
	  				if (isNaN(newValue)) {
	  					Flint.Log.warn('Invalid pitch setting (0 - 2)');
	  					return false;
		  			}
		  			newValue = (newValue < 0) ? 0 : newValue;
	  				newValue = (newValue > 2) ? 2 : newValue;
  				break;
  				case "lang":
	  				if (!isNaN(newValue)) {
	  					Flint.Log.warn('Invalid lang setting (Must be string)');
	  					return false;
	  				}
  				break;
  				default:
	  				Flint.Log.warn("Unknown voice property " + property);
	  				return false;
  			}
  			voiceSettings[property] = newValue;
  		}
  	}
  }
});

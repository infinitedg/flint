(function () {
	'use strict';

	Meteor.startup(function() {
		Session.set('station', Cookie.get('station'));
	});
	
	var soundPrefix = '/sounds/';
	var spokenPhrases = {};
	var voicePrefix = '/voices/';
	var flashInterval = 50;
	var flashTargets = [];
	window.Flint = {
		beep: function() {
			Flint.play('chime'+(Math.floor(Math.random()*6)+1) + '.wav');
		},
		playRaw: function(snd) {
			var s = new buzz.sound(snd, {autoplay: true});
		},
		play: function(snd) {
			Flint.playRaw(soundPrefix + snd);
		},
		loop: function(snd) {
			var s = new buzz.sound(soundPrefix + snd, {
				loop: true,
				autoplay: true
			});
			window.Flint.loopCache[snd] = s;
		},
		unloop: function(snd) {
			var s = window.Flint.loopCache[snd];
			if (s !== undefined) {
				s.unloop();
				window.Flint.loopCache[snd] = null;
				return true;
			} else {
				return false;
			}
			
		},
		isLooping: function(snd) {
			var s = window.Flint.loopCache[snd];
			if (s !== undefined) {
				return ($(s.get()).attr('loop') == 'loop');
			} else {
				return false;
			}
		},
		loopCache: {},
		transitionSpeed: 200,
		programmingEnabled: function(tf) {
			tf = (tf === undefined) ? true : tf;
			Session.set('_programming', (tf === true));
		},
		setMenubar: function() {
			Session.set('_programming', false);
		},
		// Choose a new station identity
		reselect: function() {
			Meteor.Router.to('/reset');
		},
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
		},
		notification: function(message, options) {
			// Prep options
			if (options === undefined) {
				options = {};
			}
			$.bootstrapGrowl(message, options);
			// From https://github.com/ifightcrime/bootstrap-growl
			
		},
		notify: function(message, options) {
			Flint.say(message);
			Flint.notification(message, options);
		},
		getStation: function() {
			var i = Session.get('station');
			if (i !== undefined) {
				return Stations.findOne(i);
			} else {
				return undefined;
			}
		},
		getSimulator: function() {
			var i = Session.get('station');
			if (i !== undefined) {
				return Simulators.findOne(Flint.getStation().simulatorId);
			} else {
				return undefined;
			}
		},
		// Invert the screen a specified number of times
		// flashTarget is an optional CSS selector for the element to be targeted, if not provided defaults to 'html'.
		flash: function(times, flashTarget) {
			if (isNaN(times) || times < 0) {
				if ($(times)) { // If times is actually a CSS selector...
					flashTarget = times;
				}
				times = 10; // Default number of flashes
			}
			
			if (flashTarget === undefined) {
				flashTarget = 'html';
			}
			
			// Don't run if we're already flashing
			if (flashTargets.indexOf(flashTarget) != -1) {
				return;
			}
			
			flashTargets.push(flashTarget);
			
			var _flashTarget = $(flashTarget);
			
			// Invert the screen. willInvert will invert the screen with truthy values, set it normal with falsey values
			var inverter = function (willInvert) {
				var x;
				if (willInvert === undefined) {
					x = (_flashTarget.css('-webkit-filter') == "invert(0)") ? 1 : 0;
				} else {
					x = (willInvert) ? 1 : 0;
				}
				_flashTarget.css('-webkit-filter','invert(' + x + ')');
			};
			
			var flashIntervalId = Meteor.setInterval(function() {
				if (times < 0) {
					inverter(false);
					flashTargets.splice(flashTargets.indexOf(flashTarget), 1);
					Meteor.clearInterval(flashIntervalId);
				} else {
					inverter();
					times--;
				}
			}, flashInterval);
		}
	};
	
	// Trigger when everything is loaded
	Meteor.startup(function(){
		meSpeak.loadConfig(voicePrefix + "mespeak_config.json");
		Flint.loadVoice('en-us');
		Flint.Log.verbose('MeSpeak loaded','Speech');
	});
}());

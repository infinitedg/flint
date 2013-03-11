(function () {
	'use strict';

	Meteor.startup(function() {
		Session.set('station', Cookie.get('station'));
	});
	
	var soundPrefix = '/sounds/';
	var spokenPhrases = {};
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
				Flint.Log.verbose('Said "'+txt+'"');
				var url = "http://translate.google.com/translate_tts?ie=UTF-8&q="+encodeURIComponent(txt)+"&tl=en&total=1&idx=0prev=input";
				Flint.playRaw(url);
				spokenPhrases[txt] = new Date().getTime();
			}
		}
	};
	
	$('.btn').click(function() {
		Flint.beep();
	});
	
	Flint.play('sciences.wav');
}());

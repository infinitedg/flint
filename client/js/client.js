(function () {
	'use strict';
	
	var soundPrefix = '/sounds/';
	window.App = {
		beep: function() {
			App.play('chime'+(Math.floor(Math.random()*6)+1)+'.wav');
		},
		play: function(snd) {
			var s = new buzz.sound(soundPrefix + snd);
			s.play();
			
		},
		loop: function(snd) {
			var s = new buzz.sound(soundPrefix + snd, {
				loop: true
			});
			window.App.loopCache[snd] = s;
			s.play();
		},
		unloop: function(snd) {
			var s;
			if (s = window.App.loopCache[snd]) {
				s.unloop();
				window.App.loopCache[snd] = null;
				return true;
			} else {
				return false;
			}
			
		},
		isLooping: function(snd) {
			var s;
			if (s = window.App.loopCache[snd]) {
				return ($(s.get()).attr('loop') == 'loop');
			} else {
				return false;
			}
		},
		loopCache: {},
		transitionSpeed: 200,
		programmingEnabeld: function(tf) {
			Session.set('_programming', (tf == true));
		}
	};
	
	$('.btn').click(function() {
		App.beep();
	});
	
	App.play('sciences.wav');
}());

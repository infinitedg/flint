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
			var s = window.App.loopCache[snd];
			if (s !== undefined) {
				s.unloop();
				window.App.loopCache[snd] = null;
				return true;
			} else {
				return false;
			}
			
		},
		isLooping: function(snd) {
			var s = window.App.loopCache[snd];
			if (s !== undefined) {
				return ($(s.get()).attr('loop') == 'loop');
			} else {
				return false;
			}
		},
		loopCache: {},
		transitionSpeed: 200,
		programmingEnabled: function(tf) {
			Session.set('_programming', (tf === true));
		},
		setMenubar: function() {
			Session.set('_programming', false);
		}
	};
	
	$('.btn').click(function() {
		App.beep();
	});
	
	App.play('sciences.wav');
}());

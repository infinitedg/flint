/**

sounds:
	parentKey			- Unique key used by other sounds when referring to this object
	simulatorId			- Simulator ID this sound is playing in
	parentSounds:		- Array of sound IDs that this sound will wait for before playing
	assetKey			- Asset key in the system
	delay				- Seconds to wait before playing, timeout saved to sound object on player for cleanup purposes (Optional)
	volume				- From 0 to 100
	looping				- Boolean - controls whether the sound is looping
	paused				- Boolean - controls whether the sound is paused
	muted				- Boolean - controls whether the sound is muted
	soundPlayers		- Array of soundPlayer objects (Optional)
	soundGroups			- Array of sound groups (Converted into soundPlayers when inserted) (Optional)
	keyId:				- key that originally scheduled this sound (Optional)
	clientId:			- Client that originally scheduled this sound (Optional)
	groupReady: 		- Boolean - If false, sound is ignored
	*/

// Used to track individual sounds playing back
var _buzzSoundCache = {};

Meteor.startup(function() {
	Deps.autorun(function(){
		var player = Flint.collection('flintSoundPlayers').findOne({playerId: Flint.clientId()});
		if (player) {
			Flint.addComponent('comp_flint_player');
		} else {
			Flint.removeComponent('comp_flint_player');
		}
	});

	Meteor.subscribe('flint.audio-engine.selfPlayer');
	Meteor.subscribe('flint.audio-engine.sounds');
});

function refreshSound(sound) {
	// Sound can be an object or a string
	// If a string, we assume it's the sound's ID and we go looking
	if (typeof sound === "string") {
		var soundObj = Flint.collection('flintSounds').findOne(sound);
		if (!soundObj) {
			Flint.Log.error("Attempt to refresh unknown sound " + sound, "flint-audio-engine");
			return;
		}
		sound = soundObj;
	}

	_buzzSoundCache[sound._id].setVolume(sound.volume || 100);

	if (sound.looping) {
		_buzzSoundCache[sound._id].setTime(0);
		_buzzSoundCache[sound._id].loop();
	} else {
		_buzzSoundCache[sound._id].unloop();
	}

	if (sound.muted) {
		_buzzSoundCache[sound._id].mute();
	} else {
		_buzzSoundCache[sound._id].unmute();
	}

	if (sound.paused) {
		_buzzSoundCache[sound._id].pause();
	} else {
		_buzzSoundCache[sound._id].play();
	}

}

Template.comp_flint_player.created = function() {
	this.playerSub = Flint.collection('flintSounds').find({ soundPlayers: { $in: [Flint.clientId()] }, parentSounds: {$size: 0} }).observe({
		added: function(sound) {
			debugger;
			var asset = Flint.a(sound.assetKey);
			if (asset) {
				if (isNaN(parseFloat(sound.delay)) || !isFinite(sound.delay)) {
					sound.delay = 0;
				}
				Meteor.setTimeout(function() {
					if (_buzzSoundCache[sound._id] == undefined){
						_buzzSoundCache[sound._id] = new buzz.sound(asset, {
							loop: sound.looping || false,
							autoplay: false
						});
						_buzzSoundCache[sound._id].load();

						_buzzSoundCache[sound._id].bindOnce("ended", function() {
							Flint.collection('flintSounds').remove(sound._id);
						});

						refreshSound(sound);
					}
				}, sound.delay);
			} else {
				Flint.Log.warn("Unable to find asset for sound playback " + sound.assetKey + "; removing sound", "flint-audio-engine");
				Flint.collection('flintSounds').remove(sound._id);
			}
		},
		changed: function(sound) {
			refreshSound(sound);
		},
		removed: function(sound) {
			debugger;
			if (_buzzSoundCache[sound._id]) {
				_buzzSoundCache[sound._id].stop();
				delete _buzzSoundCache[sound._id];
			}
		}
	});
};

Template.comp_flint_player.destroyed = function() {
	this.playerSub.stop();
};
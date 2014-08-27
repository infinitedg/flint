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
	_soundState			- Internal flag used to determine the sound's state
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

Template.comp_flint_player.created = function() {
	this.playerSub = Flint.collection('flintSounds').find({ soundPlayers: { $in: [Flint.clientId()] }, parentSounds: {$size: 0} }).observe({
		added: function(doc) {
			// Play sounds
			console.log(doc);
		}
	});
};

Template.comp_flint_player.destroyed = function() {
	this.playerSub.stop();
};
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


Meteor.startup(function() {
	Deps.autorun(function() {
		var groups = Flint.station('playerGroups');
		if (groups && groups.length && groups.length > 0) {
			Flint.addComponent("comp_flint_player");
		} else {
			Flint.removeComponent("comp_flint_player");
		}
	});
});

Template.comp_flint_player.created = function() {

};
Template.core_flint_sound.created = function(){
	Deps.autorun(function() {
		Meteor.subscribe("core.flint-sound.sounds");
	});
	Flint.collection('flintSounds').find().observe({
		added: function(doc){

		},
		changed: function(doc){

		},
		removed: function(doc){

		}
	});
};
/*

*** denotes a collection

***Structure of the sound list object:

simulatorId: Flint.simulatorId(),
name:
keys: //The array of keys which is in this sound list


*Structure of the sound key object which is in the sound list object:

id: Meteor.uuid(),
key: //The numerical code of the key which will play that particular sound
soundGroup: //The sound group object which will be created when the key is pressed


*** Structure of the sound group

simulatorId: Flint.simulatorId(),
sounds: //Array of sound objects
type: //Options - Normal, stacked, repeating, cancel, end repeating, ambiance
volume: //From 0 to 100
keyId: //The id of the key which initiated the sound.
clientId: Flint.clientId()


*** Structure of the sound object

name: //Also the sound which will be played
volume:
delay:
soundPlayer: //The location the sounds will be played. ie. bridge, engineering, etc.
			//This can refer to a group or an individual player object

*** Structure of the sound player object

name:
groupName: //Grouping is handled in this way.


*/


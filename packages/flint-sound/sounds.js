/**
@class Flint
*/

var soundPrefix = '/Sounds/Chimes';

_.extend(Flint, {
  /**
   * Trigger a random chiming sound
   * @method beep
   */
  beep: function() {
    var chimes = Flint.Asset.listFolder(soundPrefix),
    chime = chimes.containers[Math.floor(Math.random()*chimes.containers.length)+1];
    if (chime) {
      Flint.play(chime.fullPath);
    }
  },

  playRaw: function(sound) {
    if (!sound.simulatorId) {
        sound.simulatorId = Flint.simulatorId();
    }

    if (!sound.assetKey) {
      Flint.Log.error("Attempted to play sound without an assetKey", "flint-sound");
      return;
    }

    if (!sound.soundGroups || !Array.isArray(sound.soundGroups)) {
      sound.soundGroups = [];
    }

    if (!sound.soundPlayers || !Array.isArray(sound.soundPlayers)) {
      sound.soundPlayers = [Flint.clientId()];
    }

    if (sound.soundGroups.length === 0 && sound.soundPlayers.length === 0) {
      Flint.Log.error("Attempted to play sound without players or groups", "flint-sound");
      return;
    }

    if (!sound.parentKey) {
      sound.parentKey = Meteor.uuid();
    }

    Flint.collection('flintSounds').insert(sound);
  },

  play: function(assetKey, looping, opts) {
    Flint.playRaw(
      _.extend({
        assetKey: assetKey,
        looping: looping
      },
    opts));
  }
});

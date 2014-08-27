/**
@class Flint
*/

var soundPrefix = '/sounds/chimes/',
    flintFormats = ['wav', 'ogg', 'mp3'];

_.extend(Flint, {
  /**
   * Trigger a random chiming sound
   * @method beep
   */
  beep: function() {
    Flint.play(soundPrefix + 'chime'+(Math.floor(Math.random()*6)+1));
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

Flint = this.Flint || {};

  
var soundPrefix = '/sounds/';
_.extend(Flint, {
  
  /**
   * Flint.beep() triggers a random chiming sound
   */
  beep: function() {
    Flint.play('chime'+(Math.floor(Math.random()*6)+1) + '.wav');
  },

  /**
   * Play a sound automatically. Provide the full URL to the sound effect
   * @param {String} snd The URL to the sound file to play. Automatically plays when triggered.
   */
  playRaw: function(snd) {
    var s = new buzz.sound(snd, {autoplay: true});
  },

  /**
   * Convenience wrapper for Flint.playRaw to prefix the sound with the core sound path
   * @param {String} snd The sound file to play without the full relative path
   */
  play: function(snd) {
    Flint.playRaw(soundPrefix + snd);
  },

  /**
   * Trigger a basic looped sound, only one instance of a sound loopable at a time
   * @param {String} snd The name of the sound to loop
   */
  loop: function(snd) {
    var s = new buzz.sound(soundPrefix + snd, {
      loop: true,
      autoplay: true
    });
    Flint.loopCache[snd] = s;
  },

  /**
   * Cancel a looping sound.
   * @param {String} snd The name of the sound to stop looping
   * @returns {Boolean} True when successfully unlooped, false when the unlooping fails
   */ 
  unloop: function(snd) {
    var s = Flint.loopCache[snd];
    if (s !== undefined) {
      s.unloop();
      Flint.loopCache[snd] = null;
      return true;
    } else {
      return false;
    }
    
  },

  /**
   * Check if a given sound is looping
   * @param {String} snd The name of the sound to check
   * @returns {Boolean} True when it is looping, false when not looping
   */
  isLooping: function(snd) {
    var s = Flint.loopCache[snd];
    if (s !== undefined) {
      return ($(s.get()).attr('loop') === 'loop');
    } else {
      return false;
    }
  },
  loopCache: {}  
});

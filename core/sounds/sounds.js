Flint = this.Flint || {};

(function () {
  'use strict';
  
  var soundPrefix = '/sounds/';
  
  _.extend(Flint, {
    
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
      Flint.loopCache[snd] = s;
    },
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
  
}());
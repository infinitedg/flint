/**

sounds:
	parentKey			- Unique key used by other sounds when referring to this object
	simulatorId			- Simulator ID this sound is playing in
	parentSounds:		- Array of sound IDs that this sound will wait for before playing
	soundPlayers		- Array of soundPlayer objects (Optional)
	soundGroups			- Array of sound groups (Converted into soundPlayers when inserted) (Optional)
	keyId:				- key that originally scheduled this sound (Optional)
	clientId:			- Client that originally scheduled this sound (Optional)
	groupReady: 		- Boolean - If false, sound is ignored

//Stuff only necessary for playback of the sound
  assetKey      - Asset key in the system
  looping       - Boolean - controls whether the sound is looping
  playbackRate  - Number from 0 to Infinity; 1 is normal speed;
  paused        - Boolean - controls whether the sound is paused. Automatically sets the playback rate to 0 if true;
  volume        - From 0 to 100
  muted       - Boolean - controls whether the sound is muted. Automatically sets the volume to 0
  channel:      -Array - Which channels you want to produce the audio on.
  delay       - Seconds to wait before playing, timeout saved to sound object on player for cleanup purposes (Optional)
  effects:    - A hashmap of effects with the name of the effect as the key and an object as the parameters eg {filter:{gain:1,wet:0.5,...}}
  */
//
var _audioSoundCache = {};

Template.comp_flint_webaudio_player.created = function(){
	
}

function copyToChannel(destination,source,channelNumber){
  var nowBuffering = destination.getChannelData(channelNumber);
  for (var i = 0; i < source.length; i++) {
    nowBuffering[i] = source[i];
  }
  return destination;
}

//Converts a 4 or 5.1 surround audio clip into a stereo buffer.
function downMix(buffer,outputBuffer){
  if(buffer.numberOfChannels < 4){
    outputBuffer = copyToChannel(outputBuffer,buffer.getChannelData(0),0);
    outputBuffer = copyToChannel(outputBuffer,buffer.getChannelData(1),1);
  }
  if (buffer.numberOfChannels == 4){
    var nowBuffering = outputBuffer.getChannelData(0); //Left
    for (var i = 0; i < buffer.getChannelData(0).length; i++) {
      nowBuffering[i] = 0.5 * (buffer.getChannelData(0)[i] + buffer.getChannelData(2)[i]); //Left plus Surround Left
    }
    var nowBuffering = outputBuffer.getChannelData(1); //Left
    for (var i = 0; i < buffer.getChannelData(1).length; i++) {
      nowBuffering[i] = 0.5 * (buffer.getChannelData(1)[i] + buffer.getChannelData(3)[i]); //Right plus Surround Right
    }
  }
  if (buffer.numberOfChannels > 5){
    var nowBuffering = outputBuffer.getChannelData(0); //Left
    for (var i = 0; i < buffer.getChannelData(0).length; i++) {
      nowBuffering[i] = buffer.getChannelData(0)[i] + 0.7071 * (buffer.getChannelData(2)[i] + buffer.getChannelData(4)[i] + buffer.getChannelData(3)[i]); //output.L = L + 0.7071 * (input.C + input.SL)
    }
    var nowBuffering = outputBuffer.getChannelData(1); //Left
    for (var i = 0; i < buffer.getChannelData(1).length; i++) {
      nowBuffering[i] = buffer.getChannelData(1)[i] + 0.7071 * (buffer.getChannelData(2)[i] + buffer.getChannelData(5)[i] + buffer.getChannelData(3)[i]); //output.R = R + 0.7071 * (input.C + input.SR)
    }
  }
  return outputBuffer;
}




Flint.playAudioSound = function(opts){
  var self = this;
  var volume = opts.muted ? 0 : opts.volume || 1;
  var playbackRate = opts.paused ? 0 : opts.playbackRate || 1;

  self.audioContext = self.audioContext || new (window.AudioContext || window.webkitAudioContext)();
  Tuna(self.audioContext);
  self.audioContext.destination.channelCount = self.audioContext.destination.maxChannelCount;

  var channels = self.audioContext.destination.channelCount;
	// Create an object with a sound source and a volume control.
	var sound = {};
	sound.source = self.audioContext.createBufferSource();
	sound.volume = self.audioContext.createGain();
  sound.volume.gain.value = volume;
	var asset = Flint.a(opts.assetKey);

	// Connect the sound source to the volume control.
	sound.source.connect(sound.volume);

	

	// Load a sound file using an ArrayBuffer XMLHttpRequest.
	var request = new XMLHttpRequest();
	request.open("GET", asset, true);
	request.responseType = "arraybuffer";
	request.onload = function(e) {

  	// Create a buffer from the response ArrayBuffer.
    self.audioContext.decodeAudioData(this.response, function onSuccess(buffer) {
      //Create a new buffer and set it to the specified channel.
      var channel = opts.channel || [0,1];

      if (buffer.numberOfChannels == 1){
        var myArrayBuffer = self.audioContext.createBuffer(self.audioContext.destination.channelCount, buffer.duration*self.audioContext.sampleRate, self.audioContext.sampleRate);
        for (var c = 0; c < channel.length; c++) {
          if (typeof channel[c] == "object"){
            //If there is an array within the channel array, then it is 
            //assumed that the values of the array correspond to LR channels
            myArrayBuffer = copyToChannel(myArrayBuffer,buffer.getChannelData(0),channel[c][0]);
            myArrayBuffer = copyToChannel(myArrayBuffer,buffer.getChannelData(0),channel[c][1]);
          } else {
            myArrayBuffer = copyToChannel(myArrayBuffer,buffer.getChannelData(0),channel[c]);
          }
        }
      } else {
        //Do some downmixing to stereo
        //var downMixBuffer = self.audioContext.createBuffer(2, buffer.duration*self.audioContext.sampleRate, self.audioContext.sampleRate);
        //buffer = downMix(buffer,downMixBuffer);
        var myArrayBuffer = self.audioContext.createBuffer(self.audioContext.destination.channelCount, buffer.duration*self.audioContext.sampleRate, self.audioContext.sampleRate);

        for (var c = 0; c < channel.length; c++) {
          if (typeof channel[c] == "object"){
            //If there is an array within the channel array, then it is 
            //assumed that the values of the array correspond to LR channels
            myArrayBuffer = copyToChannel(myArrayBuffer,buffer.getChannelData(0),channel[c][0]);
            myArrayBuffer = copyToChannel(myArrayBuffer,buffer.getChannelData(1),channel[c][1]);
          } else {
            //Combine the two buffer channels into one.
            var downMixBuffer = self.audioContext.createBuffer(1, buffer.duration*self.audioContext.sampleRate, self.audioContext.sampleRate);
            var nowBuffering = downMixBuffer.getChannelData(0); //Mono
            for (var i = 0; i < buffer.getChannelData(0).length; i++) {
              nowBuffering[i] = 0.5 * (buffer.getChannelData(0)[i] + buffer.getChannelData(1)[i]);
            }
            myArrayBuffer = copyToChannel(myArrayBuffer,buffer.getChannelData(0),channel[c]);
          }
        }
      }
      var source = self.audioContext.createBufferSource();
      source.buffer = myArrayBuffer;
      // Make the sound source loop.
      source.loop = opts.looping || false;
      source.playbackRate.value = playbackRate;
      //Connect the source through effects nodes
      var effectsObject = {};
      var previousObject = source;
      for (var key in opts.effects){
        if (opts.effects.hasOwnProperty(key)){
          var params = opts.effects[key];
          effectsObject[key] = new Tuna[key](params);
          previousObject.connect(effectsObject[key].input)
          previousObject = effectsObject[key];
        }
      }
      
      previousObject.connect(self.audioContext.destination);
      source.start();
    }, function onFailure() {
     console.error("Decoding the audio buffer failed");
   });
};
request.send();

}

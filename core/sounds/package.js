Package.describe({
  summary: "Play sounds."
});

Package.on_use(function(api) { 
  api.use(['log', 'buzz.js']);
   
  api.add_files(['sounds.js'], 'client');
  api.add_files([
    'sounds/chime1.wav',
    'sounds/chime2.wav',
    'sounds/chime3.wav',
    'sounds/chime4.wav',
    'sounds/chime5.wav',
    'sounds/chime6.wav',
    
    'sounds/redalert.ogg',
    'sounds/redalert.wav',
    
    'sounds/sciences.mp3',
    'sounds/sciences.ogg',
    'sounds/sciences.wav',
    
    'sounds/standDown.ogg'
  ], 'client');
});

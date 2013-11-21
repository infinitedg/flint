Package.describe({
  summary: 'Core Flint library'
});

Package.on_use(function(api) {  
  api.use(['iron-router', 'underscore']);
  api.use(['winston', 'winston-loggly'], ['server']);
	api.use(['templating', 'winston-client', 'bootstrap-growl'], ['client']);
  
  api.add_files(['flint.js', 'logger.js', 'collection.js'], ['server', 'client']);
  api.add_files(['server/fixture.js', 'server/reset.js', 'server/actor.js', 'server/picker.js'], 'server');
  
  // To enable other voices, add them to this list as "voices/<voice name>.json"
  api.add_files(['voices/mespeak_config.json', 'voices/en-us.json', 'lib/mespeak.js', 'client/voice.js'], 'client');
  api.add_files(['client/notifications.js', 'client/flint.html', 'client/picker.js', 'client/router.js'], 'client');
  
  // Flint-Sounds
  api.use('buzz.js', 'client');
  api.add_files(['client/sounds.js'], 'client');
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

  api.export("Flint");
});

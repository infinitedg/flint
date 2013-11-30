Package.describe({
  summary: 'Adds speech to flint capabilities'
});

Package.on_use(function(api) {  

  api.use(['flint', 'underscore'], ['client']);
  
  // To enable other voices, add them to this list as "voices/<voice name>.json"
  api.add_files(['voices/mespeak_config.json', 'voices/en-us.json', 'lib/mespeak.js', 'voice.js'], 'client');
  
});
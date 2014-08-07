Package.describe({
  summary: 'Adds speech to flint capabilities',
  version: "0.1.0"
});

Package.on_use(function(api) {  

  api.use(['flint', 'underscore'], ['client']);
  
  // To enable other voices, add them to this list as "voices/<voice name>.json"
  api.add_files(['voice.js'], 'client');
  
});

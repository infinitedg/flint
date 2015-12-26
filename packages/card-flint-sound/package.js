Package.describe({
  summary: "Flint station management system",
  version: "0.1.0"
});

Package.on_use(function(api) {  
  api.use(['templating', 'flint', 'underscore', 'flint-audio-pedals']);
  api.add_files(['card.html', 'card.js', 'card.css'], 'client');
  api.add_files(['core.html', 'core.js'], 'client');
  api.add_files(['ambiance.html','ambiance.js'],'client');
  api.add_files(['server.js'], 'server');
  api.add_files(['publish.js'],['server']);
});

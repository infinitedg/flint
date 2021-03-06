Package.describe({
  "summary": "Basic Engine Control",
  version: "0.1.0"
});

Package.on_use(function(api) {  
  api.use(['templating', 'flint', 'mizzao:bootboxjs', 'flint-jobs', 'underscore']);
  
  api.add_files(['actor.js'], 'server');
  api.add_files(['core.html', 'core.js'], 'client');
  api.add_files(['card.html', 'card.js', 'card.css'], 'client');
});

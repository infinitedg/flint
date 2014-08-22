Package.describe({
  "summary": "Used to compose long range messages.",
  version: "0.1.0"
});

Package.on_use(function(api) {  
  api.use(['templating', 'flint', 'mizzao:bootboxjs']);
  api.add_files(['publish.js'], 'server');
  api.add_files(['model.js'], ['server', 'client']);
  api.add_files(['core.html', 'core.js'], 'client');
  api.add_files(['card.html', 'card.js', 'card.css'], 'client');
});

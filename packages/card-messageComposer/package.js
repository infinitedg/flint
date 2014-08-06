Package.describe({
  "summary": "Used to compose long range messages."
});

Package.on_use(function(api) {  
  api.use(['templating', 'flint', 'bootboxjs']);
  api.add_files(['publish.js'], 'server');
  api.add_files(['model.js'], ['server', 'client']);
  api.add_files(['core.html', 'core.js'], 'client');
  api.add_files(['card.html', 'card.js', 'card.css'], 'client');
});
